/**
 * Halloween Keypad blocks - Simple 5x5 keypad for kids!
 */
//% weight=100 color=#ff6600 icon="\uf11c" block="Halloween Keypad"
namespace HalloweenKeypad {

    // I2C address for TCA8418
    const TCA8418_ADDR = 0x34;

    // Register addresses
    const REG_CFG = 0x01;
    const REG_INT_STAT = 0x02;
    const REG_KEY_EVENT_A = 0x04;
    const REG_KP_GPIO1 = 0x1D;
    const REG_KP_GPIO2 = 0x1E;
    const REG_KP_GPIO3 = 0x1F;
    const REG_DEBOUNCE_DIS1 = 0x29;
    const REG_DEBOUNCE_DIS2 = 0x2A;
    const REG_DEBOUNCE_DIS3 = 0x2B;

    let initialized = false;
    let lastKeyPressed = -1;
    let lastKeyReleased = -1;

    // Track currently pressed keys (0..24)
    let pressedKeys: boolean[] = [];

    // Event queue to bridge interrupt handler and polling waiters
    interface KeyEvent {
        key: number;
        pressed: boolean;
    }
    let eventQueue: KeyEvent[] = [];

    // Key press handlers for each button (0-24)
    let keyPressHandlers: (() => void)[] = [];
    let keyReleaseHandlers: (() => void)[] = [];

    // Generic handlers for any key press/release (receives key number)
    let anyKeyPressHandlers: ((key: number) => void)[] = [];
    let anyKeyReleaseHandlers: ((key: number) => void)[] = [];

    /**
     * Initialize the 5x5 keypad
     */
    //% blockId="halloween_keypad_initialize"
    //% block="initialize Halloween keypad"
    //% weight=100
    export function initialize(): void {
        // Configure for 5x5 keypad matrix
        writeRegister(REG_KP_GPIO1, 0x1f);  // R0-R4 as keypad
        writeRegister(REG_KP_GPIO2, 0x1f);  // C0-C4 as keypad
        writeRegister(REG_KP_GPIO3, 0x00);  // Not used

        // Enable debounce for R0-R4 and C0-C4 (5x5 keypad)
        // 0 = debounce enabled, 1 = debounce disabled
        writeRegister(REG_DEBOUNCE_DIS1, 0xE0);  // R0-R4 enabled (bits 0-4=0), R5-R7 disabled (bits 5-7=1)
        writeRegister(REG_DEBOUNCE_DIS2, 0xE0);  // C0-C4 enabled (bits 0-4=0), C5-C7 disabled (bits 5-7=1)
        writeRegister(REG_DEBOUNCE_DIS3, 0xFF);  // All disabled (not used)

        clearEvents();

        // Configure interrupts and events
        // 0x09 = INT enabled + Event mode + OVR flow (level-triggered, stays low while FIFO has events)
        writeRegister(REG_CFG, 0x09);  // Enable key events + interrupt (edge mode)

        // Reset pressed state
        lastKeyPressed = -1;
        lastKeyReleased = -1;
        for (let i = 0; i < 25; i++) pressedKeys[i] = false;
        
        // Clear software event queue
        eventQueue = [];

        initialized = true;

        // Set up IRQ pin (P2) as input with pull-up
        pins.setPull(DigitalPin.P2, PinPullMode.PullUp);

        // Enable pin events on P2 - this is required before control.onEvent() works
        pins.setEvents(DigitalPin.P2, PinEventType.Edge);

        // Set up interrupt handler on P2 falling edge
        control.onEvent(EventBusSource.MICROBIT_ID_IO_P2, EventBusValue.MICROBIT_PIN_EVT_FALL, function () {
            processKeyEvents();
        });
    }

    /**
     * Wait for any key to be pressed
     */
    //% blockId="halloween_keypad_wait_any_press"
    //% block="wait for any key press (timeout $timeoutMs ms)"
    //% timeoutMs.defl=0
    //% weight=95
    export function waitForAnyKey(timeoutMs?: number): number {
        // Instant check if timeout is 0
        if (timeoutMs === 0) {
            const event = dequeueEvent();
            return (event && event.pressed && event.key >= 0) ? event.key : -1;
        }
        
        const start = input.runningTime();
        while (true) {
            const event = dequeueEvent();
            if (event && event.pressed && event.key >= 0) {
                return event.key;
            }
            if (timeoutMs && timeoutMs > 0 && (input.runningTime() - start) > timeoutMs) {
                return -1;
            }
            basic.pause(10);
        }
    }

    /**
     * Wait for any key to be released
     */
    //% blockId="halloween_keypad_wait_any_release"
    //% block="wait for any key release (timeout $timeoutMs ms)"
    //% timeoutMs.defl=0
    //% weight=95
    export function waitForAnyKeyRelease(timeoutMs?: number): number {
        // Instant check if timeout is 0
        if (timeoutMs === 0) {
            const event = dequeueEvent();
            return (event && !event.pressed && event.key >= 0) ? event.key : -1;
        }
        
        const start = input.runningTime();
        while (true) {
            const event = dequeueEvent();
            if (event && !event.pressed && event.key >= 0) {
                return event.key;
            }
            if (timeoutMs && timeoutMs > 0 && (input.runningTime() - start) > timeoutMs) {
                return -1;
            }
            basic.pause(10);
        }
    }

    /**
     * Wait for a specific key to be pressed
     * @param keyNumber the key number (0-24) to wait for
     */
    //% blockId="halloween_keypad_wait_key_press"
    //% block="wait for key $keyNumber to be pressed (timeout $timeoutMs ms)"
    //% keyNumber.min=0 keyNumber.max=24 keyNumber.defl=0
    //% timeoutMs.defl=0
    //% weight=90
    export function waitForKeyPress(keyNumber: number, timeoutMs?: number): boolean {
        // Instant check if timeout is 0
        if (timeoutMs === 0) {
            const event = dequeueEvent();
            return !!(event && event.pressed && event.key === keyNumber);
        }
        
        const start = input.runningTime();
        while (true) {
            const event = dequeueEvent();
            if (event && event.pressed && event.key === keyNumber) {
                return true;
            }
            if (timeoutMs && timeoutMs > 0 && (input.runningTime() - start) > timeoutMs) {
                return false;
            }
            basic.pause(10);
        }
    }

    /**
     * Wait for a specific key to be released
     * @param keyNumber the key number (0-24) to wait for
     */
    //% blockId="halloween_keypad_wait_key_release"
    //% block="wait for key $keyNumber to be released (timeout $timeoutMs ms)"
    //% keyNumber.min=0 keyNumber.max=24 keyNumber.defl=0
    //% timeoutMs.defl=0
    //% weight=90
    export function waitForKeyRelease(keyNumber: number, timeoutMs?: number): boolean {
        // Instant check if timeout is 0
        if (timeoutMs === 0) {
            const event = dequeueEvent();
            return !!(event && !event.pressed && event.key === keyNumber);
        }
        
        const start = input.runningTime();
        while (true) {
            const event = dequeueEvent();
            if (event && !event.pressed && event.key === keyNumber) {
                return true;
            }
            if (timeoutMs && timeoutMs > 0 && (input.runningTime() - start) > timeoutMs) {
                return false;
            }
            basic.pause(10);
        }
    }

    /**
     * Check if a specific key is pressed right now
     */
    //% blockId="halloween_keypad_is_pressed"
    //% block="key $keyNumber is pressed"
    //% keyNumber.min=0 keyNumber.max=24 keyNumber.defl=0
    //% weight=85
    export function isKeyPressed(keyNumber: number): boolean {
        if (!initialized) return false;
        if (keyNumber < 0 || keyNumber > 24) return false;
        return !!pressedKeys[keyNumber];
    }

    /**
     * Get the last key that was pressed
     */
    //% blockId="halloween_keypad_last_pressed"
    //% block="last key pressed"
    //% weight=80
    export function getLastKeyPressed(): number {
        return lastKeyPressed;
    }

    /**
     * Get the last key that was released (0-24, or -1 if none)
     */
    //% blockId="halloween_keypad_last_released"
    //% block="last key released"
    //% weight=80
    export function getLastKeyReleased(): number {
        return lastKeyReleased;
    }

    /**
     * Clear all pending key events from the queue
     * Useful to discard old keypresses (e.g., after showing instructions, before starting a game)
     */
    //% blockId="halloween_keypad_clear_queue"
    //% block="clear pending key events"
    //% weight=78
    export function clearEventQueue(): void {
        eventQueue = [];
    }

    /**
     * Do something when a specific key is pressed
     * @param keyNumber the key number (0-24)
     * @param handler the code to run when key is pressed
     */
    //% blockId="halloween_keypad_on_key_pressed"
    //% block="when key $keyNumber is pressed"
    //% keyNumber.min=0 keyNumber.max=24 keyNumber.defl=0
    //% weight=70
    export function onKeyPressed(keyNumber: number, handler: () => void): void {
        // Guard against out-of-range keys
        if (keyNumber >= 0 && keyNumber <= 24) {
            keyPressHandlers[keyNumber] = handler;
        }
    }

    /**
     * Do something when a specific key is released
     * @param keyNumber the key number (0-24)
     * @param handler the code to run when key is released
     */
    //% blockId="halloween_keypad_on_key_released"
    //% block="when key $keyNumber is released"
    //% keyNumber.min=0 keyNumber.max=24 keyNumber.defl=0
    //% weight=70
    export function onKeyReleased(keyNumber: number, handler: () => void): void {
        // Guard against out-of-range keys
        if (keyNumber >= 0 && keyNumber <= 24) {
            keyReleaseHandlers[keyNumber] = handler;
        }
    }

    /**
     * Do something when any key is pressed (key number is provided)
     * @param handler the code to run when any key is pressed
     */
    //% blockId="halloween_keypad_on_any_pressed"
    //% block="when any key is pressed"
    //% draggableParameters="reporter"
    //% weight=75
    export function onAnyKeyPressed(handler: (key: number) => void): void {
        anyKeyPressHandlers.push(handler);
    }

    /**
     * Do something when any key is released
     * @param handler the code to run (receives key number)
     */
    //% blockId="halloween_keypad_on_any_released"
    //% block="when any key is released"
    //% draggableParameters="reporter"
    //% weight=74
    export function onAnyKeyReleased(handler: (key: number) => void): void {
        anyKeyReleaseHandlers.push(handler);
    }

    /**
     * Wait for a specific sequence of keys to be pressed in order
     * @param keys array of key numbers in sequence
     */
    //% blockId="halloween_keypad_wait_sequence"
    //% block="wait for key sequence $keys (timeout $timeoutMs ms)"
    //% keys.shadow="lists_create_with"
    //% timeoutMs.defl=10000
    //% weight=65
    export function waitForSequence(keys: number[], timeoutMs?: number): boolean {
        let idx = 0;
        let startTime = input.runningTime();
        let timeout = (timeoutMs && timeoutMs > 0) ? timeoutMs : 10000; // default 10 seconds
        
        // Instant check if timeout is 0 - try to match entire sequence from queue
        if (timeoutMs === 0) {
            while (idx < keys.length) {
                let event = dequeueEvent();
                if (!event || !event.pressed || event.key !== keys[idx]) return false;
                idx++;
            }
            return true;
        }

        while (idx < keys.length) {
            if (input.runningTime() - startTime > timeout) return false;

            let event = dequeueEvent();
            if (event && event.pressed && event.key >= 0) {
                if (event.key !== keys[idx]) return false;
                idx++;
            }
            basic.pause(10);
        }

        return true;
    }

    /**
     * Check which row a key is in (0-4)
     * @param keyNumber the key number (0-24)
     */
    //% blockId="halloween_keypad_get_row"
    //% block="row of key $keyNumber"
    //% keyNumber.min=0 keyNumber.max=24 keyNumber.defl=0
    //% weight=60
    export function getKeyRow(keyNumber: number): number {
        return Math.floor(keyNumber / 5);
    }

    /**
     * Check which column a key is in (0-4)
     * @param keyNumber the key number (0-24)
     */
    //% blockId="halloween_keypad_get_column"
    //% block="column of key $keyNumber"
    //% keyNumber.min=0 keyNumber.max=24 keyNumber.defl=0
    //% weight=55
    export function getKeyColumn(keyNumber: number): number {
        return (keyNumber % 5);
    }

    // ===== Helper Functions (Hidden from blocks) =====

    function writeRegister(reg: number, value: number): void {
        pins.i2cWriteNumber(TCA8418_ADDR, (reg << 8) | value, NumberFormat.UInt16BE);
    }

    function readRegister(reg: number): number {
        pins.i2cWriteNumber(TCA8418_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(TCA8418_ADDR, NumberFormat.UInt8BE);
    }

    function clearEvents(): void {
        // Read all events to clear FIFO
        for (let i = 0; i < 10; i++) {
            let event = readRegister(REG_KEY_EVENT_A);
            if (event === 0) break;
        }
        // Explicitly clear INT_STAT: 0x03 = clear both K_INT (bit 0) and OVR_FLOW_INT (bit 1)
        writeRegister(REG_INT_STAT, 0x03);
    }

    /**
     * Read a single key event from hardware FIFO (internal use)
     * Returns the key event or null if FIFO is empty
     */
    function readKeyEventFromHardware(): KeyEvent | null {
        if (!initialized) return null;

        // Drain FIFO until we find a valid 5x5 key or FIFO is empty
        while (true) {
            const event = readRegister(REG_KEY_EVENT_A);
            if (event === 0) break; // FIFO empty

            const keyCode = event & 0x7F;
            const pressed = (event & 0x80) != 0;  // Bit 7: 1=press, 0=release

            // Decode row/col: upper nibble=row (0..7), lower nibble=column (1..10)
            const col = keyCode % 10;
            const row = Math.floor(keyCode / 10);

            // Only accept keys within 5x5 (rows 0-4, cols 1-5)
            if (row >= 0 && row < 5 && col >= 1 && col < 6) {
                const keyNumber = (row * 5) + col - 1; // map to 0..24
                return { key: keyNumber, pressed: pressed };
            }

            // continue draining if out-of-bounds
        }

        return null;
    }

    /**
     * Dequeue an event from the software queue
     * Updates lastKeyPressed/lastKeyReleased and pressedKeys state
     */
    function dequeueEvent(): KeyEvent | null {
        if (eventQueue.length === 0) return null;

        const event = eventQueue.shift();
        if (event) {
            // Update tracking state
            if (event.pressed) {
                lastKeyPressed = event.key;
            } else {
                lastKeyReleased = event.key;
            }
            pressedKeys[event.key] = event.pressed;
        }
        return event;
    }

    function processKeyEvents(): void {
        // Called by IRQ handler - read from hardware and enqueue events
        while (true) {
            const event = readKeyEventFromHardware();
            if (!event) break;

            // Add to queue for waiters
            eventQueue.push(event);

            // Also update state for immediate handlers
            if (event.pressed) {
                lastKeyPressed = event.key;
            } else {
                lastKeyReleased = event.key;
            }
            pressedKeys[event.key] = event.pressed;

            // Trigger any registered handlers immediately
            if (event.pressed) {
                if (keyPressHandlers[event.key]) keyPressHandlers[event.key]();
                for (let h of anyKeyPressHandlers) h(event.key);
            } else {
                if (keyReleaseHandlers[event.key]) keyReleaseHandlers[event.key]();
                for (let h of anyKeyReleaseHandlers) h(event.key);
            }
        }
        // Explicitly clear INT_STAT: 0x03 = clear both K_INT (bit 0) and OVR_FLOW_INT (bit 1)
        // Write 1 to Clear (W1C) register
        writeRegister(REG_INT_STAT, 0x03);
    }
}
