# Halloween Keypad 🎃

A super simple keypad extension for your Halloween Box project! Made for kids to use with MakeCode blocks.

## What's Inside?

A 5x5 button keypad - that's **25 buttons** arranged like this:

```
[ 1] [ 2] [ 3] [ 4] [ 5]
[ 6] [ 7] [ 8] [ 9] [10]
[11] [12] [13] [14] [15]
[16] [17] [18] [19] [20]
[21] [22] [23] [24] [25]
```

## How to Use (For Kids!) 🎮

### Step 1: Initialize the keypad
Always start with this block:
```blocks
HalloweenKeypad.initialize()
```

### Step 2: Wait for a button press
```blocks
let key = HalloweenKeypad.waitForAnyKey()
basic.showNumber(key)
```

### Step 3: Check if a specific button is pressed
```blocks
if (HalloweenKeypad.isKeyPressed(5)) {
    basic.showIcon(IconNames.Happy)
}
```

### Step 4: Do something when a button is pressed
```blocks
HalloweenKeypad.onKeyPressed(1, function () {
    basic.showIcon(IconNames.Heart)
})
```

## Cool Examples! 🎉

### Secret Code Lock
```blocks
HalloweenKeypad.initialize()
basic.showString("Enter Code!")

if (HalloweenKeypad.waitForSequence(1, 2, 3)) {
    basic.showIcon(IconNames.Yes)
    music.playTone(262, 500)
} else {
    basic.showIcon(IconNames.No)
}
```

### Button Number Display
```blocks
HalloweenKeypad.initialize()
HalloweenKeypad.showKeyNumbers()
```

### Simple Game
```blocks
HalloweenKeypad.initialize()
basic.showString("Press 13!")

HalloweenKeypad.waitForKey(13)
basic.showIcon(IconNames.Yes)
basic.showString("You Win!")
```

## Wiring 🔌

### micro:bit to TCA8418:
- **P19** → SCL (clock)
- **P20** → SDA (data)
- **P2** → IRQ (interrupt)
- **3.3V** → Power
- **GND** → Ground

### Matrix Keypad Wiring:
⚠️ **IMPORTANT:** Your 5×5 keypad matrix needs diodes to prevent ghosting!

**📚 See detailed guides:**
- **[WIRING_GUIDE.md](WIRING_GUIDE.md)** - Complete wiring tutorial with diode installation
- **[DIODE_QUICK_REF.md](DIODE_QUICK_REF.md)** - Quick reference card for workbench

**Quick summary:** Install one 1N4148 diode per key with the cathode (stripe) pointing toward the COLUMN (anode toward ROW).

## For Parents/Teachers 👨‍🏫

This extension wraps the TCA8418 I²C keypad controller in simple, kid-friendly blocks. Kids can:
- Wait for button presses
- Check which button was pressed
- Create secret codes
- Make interactive games

Perfect for ages 6-8 with supervision, or 9+ independently!

## License

MIT

---

Made with ❤️ for the Halloween Box Project
