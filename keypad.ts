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
    let lastKey = 0;
    let irqEnabled = false;
    
    // Key press handlers for each button (1-25)
    let keyHandlers: (() => void)[] = [];
    
    /**
     * Initialize the 5x5 keypad
     */
    //% block="initialize Halloween keypad"
    //% weight=100
    export function initialize(): void {
        if (initialized) return;
        
        // Configure for 5x5 keypad matrix
        writeRegister(REG_KP_GPIO1, 0xFF);  // R0-R4, C0-C2 as keypad
        writeRegister(REG_KP_GPIO2, 0x03);  // C3-C4 as keypad
        writeRegister(REG_KP_GPIO3, 0x00);  // Not used
        
        // Enable debounce
        writeRegister(REG_DEBOUNCE_DIS1, 0x00);
        writeRegister(REG_DEBOUNCE_DIS2, 0xFC);
        writeRegister(REG_DEBOUNCE_DIS3, 0xFF);
        
        // Configure interrupts and events
        writeRegister(REG_CFG, 0x19);  // Enable key events + interrupt + overflow
        
        // Clear any pending events
        clearEvents();
        
        // Set up IRQ pin (P2) as input with pull-up
        pins.setPull(DigitalPin.P2, PinPullMode.PullUp);
        
        initialized = true;
        irqEnabled = true;
        
        // Set up interrupt handler on P2 (active low)
        pins.onPulsed(DigitalPin.P2, PulseValue.Low, function () {
            processKeyEvents();
        });
        
        // Also start background checker as fallback (in case IRQ not connected)
        control.inBackground(checkKeys);
    }
    
    /**
     * Wait for any key to be pressed
     */
    //% block="wait for any key press"
    //% weight=95
    export function waitForAnyKey(): number {
        while (true) {
            let key = readKeyPress();
            if (key > 0) {
                return key;
            }
            basic.pause(10);
        }
    }
    
    /**
     * Wait for a specific key to be pressed
     * @param keyNumber the key number (1-25) to wait for
     */
    //% block="wait for key $keyNumber to be pressed"
    //% keyNumber.min=1 keyNumber.max=25 keyNumber.defl=1
    //% weight=90
    export function waitForKey(keyNumber: number): void {
        while (true) {
            let key = readKeyPress();
            if (key === keyNumber) {
                return;
            }
            basic.pause(10);
        }
    }
    
    /**
     * Check if a specific key is pressed right now
     * @param keyNumber the key number (1-25) to check
     */
    //% block="key $keyNumber is pressed"
    //% keyNumber.min=1 keyNumber.max=25 keyNumber.defl=1
    //% weight=85
    export function isKeyPressed(keyNumber: number): boolean {
        let key = readKeyPress();
        return key === keyNumber;
    }
    
    /**
     * Get the last key that was pressed
     */
    //% block="last key pressed"
    //% weight=80
    export function getLastKey(): number {
        return lastKey;
    }
    
    /**
     * Show the key number on the LED display when pressed
     */
    //% block="show key numbers on LEDs"
    //% weight=75
    export function showKeyNumbers(): void {
        control.inBackground(() => {
            while (true) {
                let key = readKeyPress();
                if (key > 0) {
                    basic.showNumber(key);
                    basic.pause(500);
                    basic.clearScreen();
                }
                basic.pause(50);
            }
        });
    }
    
    /**
     * Do something when a specific key is pressed
     * @param keyNumber the key number (1-25)
     * @param handler the code to run when key is pressed
     */
    //% block="when key $keyNumber is pressed"
    //% keyNumber.min=1 keyNumber.max=25 keyNumber.defl=1
    //% weight=70
    export function onKeyPressed(keyNumber: number, handler: () => void): void {
        keyHandlers[keyNumber] = handler;
    }
    
    /**
     * Wait for a sequence of keys (like a secret code!)
     * @param key1 first key in sequence
     * @param key2 second key in sequence
     * @param key3 third key in sequence
     */
    //% block="wait for secret code: $key1 then $key2 then $key3"
    //% key1.min=1 key1.max=25 key1.defl=1
    //% key2.min=1 key2.max=25 key2.defl=2
    //% key3.min=1 key3.max=25 key3.defl=3
    //% weight=65
    export function waitForSequence(key1: number, key2: number, key3: number): boolean {
        let sequence = [key1, key2, key3];
        let entered: number[] = [];
        let startTime = input.runningTime();
        let timeout = 10000; // 10 seconds
        
        while (entered.length < 3) {
            // Check timeout
            if (input.runningTime() - startTime > timeout) {
                return false;
            }
            
            let key = readKeyPress();
            if (key > 0) {
                entered.push(key);
                
                // Check if wrong key
                if (entered[entered.length - 1] !== sequence[entered.length - 1]) {
                    return false;
                }
                
                // Small delay between keys
                basic.pause(300);
            }
            basic.pause(50);
        }
        
        return true;
    }
    
    /**
     * Check which row a key is in (1-5)
     * @param keyNumber the key number (1-25)
     */
    //% block="row of key $keyNumber"
    //% keyNumber.min=1 keyNumber.max=25 keyNumber.defl=1
    //% weight=60
    export function getKeyRow(keyNumber: number): number {
        return Math.ceil(keyNumber / 5);
    }
    
    /**
     * Check which column a key is in (1-5)
     * @param keyNumber the key number (1-25)
     */
    //% block="column of key $keyNumber"
    //% keyNumber.min=1 keyNumber.max=25 keyNumber.defl=1
    //% weight=55
    export function getKeyColumn(keyNumber: number): number {
        return ((keyNumber - 1) % 5) + 1;
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
    }
    
    function readKeyPress(): number {
        if (!initialized) return 0;
        
        // If IRQ enabled, check pin state first (more efficient)
        if (irqEnabled && pins.digitalReadPin(DigitalPin.P2) == 1) {
            // IRQ not active (high), no events pending
            return 0;
        }
        
        // Check interrupt status register
        let intStat = readRegister(REG_INT_STAT);
        
        if (intStat & 0x01) {  // Key event
            let event = readRegister(REG_KEY_EVENT_A);
            
            if (event > 0) {
                let keyCode = event & 0x7F;
                let pressed = !(event & 0x80);  // Bit 7: 0=press, 1=release
                
                if (pressed) {
                    // Convert key code to key number (1-25)
                    let row = Math.floor(keyCode / 10);
                    let col = keyCode % 10;
                    let keyNumber = (row * 5) + col + 1;
                    
                    if (keyNumber >= 1 && keyNumber <= 25) {
                        lastKey = keyNumber;
                        return keyNumber;
                    }
                }
            }
        }
        
        return 0;
    }
    
    function processKeyEvents(): void {
        // Called by IRQ handler - process all pending events
        while (true) {
            let key = readKeyPress();
            if (key == 0) break;
            
            // Trigger any registered handlers
            if (keyHandlers[key]) {
                keyHandlers[key]();
            }
        }
    }
    
    function checkKeys(): void {
        while (true) {
            let key = readKeyPress();
            
            if (key > 0 && keyHandlers[key]) {
                keyHandlers[key]();
            }
            
            basic.pause(10);
        }
    }
}
