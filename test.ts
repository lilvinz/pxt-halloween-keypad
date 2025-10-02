// Tests for Halloween Keypad - Fun examples for kids!

/**
 * Test 1: Show which button is pressed
 */
//% block="Test: Show button numbers"
function testShowNumbers(): void {
    HalloweenKeypad.initialize()
    basic.showString("Press buttons!")
    HalloweenKeypad.showKeyNumbers()
}

/**
 * Test 2: Wait for button 13 (middle button!)
 */
//% block="Test: Press middle button"
function testMiddleButton(): void {
    HalloweenKeypad.initialize()
    basic.showString("Press 13!")
    HalloweenKeypad.waitForKey(13)
    basic.showIcon(IconNames.Yes)
    music.playTone(523, 500)
}

/**
 * Test 3: Secret code 1-2-3
 */
//% block="Test: Secret code"
function testSecretCode(): void {
    HalloweenKeypad.initialize()
    basic.showString("Code: 1-2-3")
    
    if (HalloweenKeypad.waitForSequence(1, 2, 3)) {
        basic.showIcon(IconNames.Yes)
        basic.showString("Correct!")
        music.playMelody("C D E F G A B C5 ", 120)
    } else {
        basic.showIcon(IconNames.No)
        basic.showString("Wrong!")
        music.playTone(131, 500)
    }
}

/**
 * Test 4: Make different corners do different things
 */
//% block="Test: Corner buttons"
function testCorners(): void {
    HalloweenKeypad.initialize()
    basic.showString("Press corners!")
    
    HalloweenKeypad.onKeyPressed(1, function () {
        basic.showString("Top Left!")
    })
    
    HalloweenKeypad.onKeyPressed(5, function () {
        basic.showString("Top Right!")
    })
    
    HalloweenKeypad.onKeyPressed(21, function () {
        basic.showString("Bottom Left!")
    })
    
    HalloweenKeypad.onKeyPressed(25, function () {
        basic.showString("Bottom Right!")
    })
}

/**
 * Test 5: Simple counting game
 */
//% block="Test: Counting game"
function testCountingGame(): void {
    HalloweenKeypad.initialize()
    basic.showString("Count 1-5!")
    
    for (let i = 1; i <= 5; i++) {
        basic.showNumber(i)
        HalloweenKeypad.waitForKey(i)
        music.playTone(262 + (i * 50), 200)
    }
    
    basic.showIcon(IconNames.Yes)
    basic.showString("You did it!")
}

/**
 * Test 6: Memory game - repeat the pattern!
 */
//% block="Test: Memory game"
function testMemoryGame(): void {
    HalloweenKeypad.initialize()
    
    let pattern = [3, 7, 13, 19, 23]
    
    basic.showString("Watch!")
    for (let key of pattern) {
        basic.showNumber(key)
        basic.pause(800)
        basic.clearScreen()
        basic.pause(200)
    }
    
    basic.showString("Your turn!")
    
    for (let key of pattern) {
        let pressed = HalloweenKeypad.waitForAnyKey()
        basic.showNumber(pressed)
        basic.pause(300)
        
        if (pressed !== key) {
            basic.showIcon(IconNames.No)
            basic.showString("Oops!")
            return
        }
    }
    
    basic.showIcon(IconNames.Yes)
    basic.showString("Perfect!")
}
