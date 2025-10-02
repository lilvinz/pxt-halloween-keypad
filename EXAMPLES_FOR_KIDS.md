# 🎃 Super Fun Examples for Kids!

## 🌟 Example 1: Light Show Buttons

**What it does:** Each corner button makes a different pattern!

```blocks
HalloweenKeypad.initialize()

HalloweenKeypad.onKeyPressed(1, function () {
    basic.showIcon(IconNames.Heart)
})

HalloweenKeypad.onKeyPressed(5, function () {
    basic.showIcon(IconNames.Happy)
})

HalloweenKeypad.onKeyPressed(21, function () {
    basic.showIcon(IconNames.Sad)
})

HalloweenKeypad.onKeyPressed(25, function () {
    basic.showIcon(IconNames.Skull)
})

basic.showString("Press corners!")
```

---

## 🎵 Example 2: Piano Buttons

**What it does:** Turn your keypad into a piano!

```blocks
HalloweenKeypad.initialize()
basic.showIcon(IconNames.Music)

basic.forever(function () {
    let key = HalloweenKeypad.getLastKey()
    
    if (key == 1) {
        music.playTone(262, 200)  // C
    } else if (key == 2) {
        music.playTone(294, 200)  // D
    } else if (key == 3) {
        music.playTone(330, 200)  // E
    } else if (key == 6) {
        music.playTone(349, 200)  // F
    } else if (key == 7) {
        music.playTone(392, 200)  // G
    } else if (key == 8) {
        music.playTone(440, 200)  // A
    } else if (key == 11) {
        music.playTone(494, 200)  // B
    } else if (key == 12) {
        music.playTone(523, 200)  // C high
    }
})
```

---

## 🎮 Example 3: Guessing Game

**What it does:** micro:bit picks a secret number, you guess it!

```blocks
HalloweenKeypad.initialize()

let secret = randint(1, 25)
basic.showString("Guess 1-25")

basic.forever(function () {
    let guess = HalloweenKeypad.waitForAnyKey()
    
    if (guess == secret) {
        basic.showIcon(IconNames.Yes)
        basic.showString("You win!")
        music.playMelody("C D E F G A B C5", 120)
        secret = randint(1, 25)
        basic.showString("New number!")
    } else if (guess < secret) {
        basic.showArrow(ArrowNames.North)
        basic.showString("Higher!")
    } else {
        basic.showArrow(ArrowNames.South)
        basic.showString("Lower!")
    }
})
```

---

## 🧠 Example 4: Super Memory Game

**What it does:** Remember and repeat the pattern!

```blocks
HalloweenKeypad.initialize()

let pattern: number[] = []
let level = 1

function showPattern() {
    basic.showString("Watch!")
    basic.pause(500)
    
    for (let num of pattern) {
        basic.showNumber(num)
        music.playTone(262 + (num * 20), 300)
        basic.pause(800)
        basic.clearScreen()
        basic.pause(300)
    }
    
    basic.showString("GO!")
}

function playRound() {
    // Add new random number to pattern
    pattern.push(randint(1, 9))
    
    showPattern()
    
    // Player's turn
    for (let i = 0; i < pattern.length; i++) {
        let pressed = HalloweenKeypad.waitForAnyKey()
        basic.showNumber(pressed)
        basic.pause(300)
        
        if (pressed != pattern[i]) {
            basic.showIcon(IconNames.No)
            basic.showString("Game Over")
            basic.showString("Level: " + level)
            // Reset game
            pattern = []
            level = 1
            basic.pause(2000)
            return
        }
    }
    
    // Success!
    basic.showIcon(IconNames.Yes)
    level += 1
    basic.showString("Level " + level)
    basic.pause(1000)
}

basic.showString("Memory!")
basic.forever(function () {
    playRound()
})
```

---

## 🏃 Example 5: Speed Test

**What it does:** How fast can you press the buttons?

```blocks
HalloweenKeypad.initialize()

basic.showString("Ready?")
basic.pause(1000)
basic.showString("GO!")

let startTime = input.runningTime()
let count = 0

// Press any 10 buttons as fast as you can!
for (let i = 0; i < 10; i++) {
    HalloweenKeypad.waitForAnyKey()
    count += 1
    basic.showNumber(count)
}

let endTime = input.runningTime()
let totalTime = (endTime - startTime) / 1000

basic.showIcon(IconNames.Yes)
basic.showString("Time:")
basic.showNumber(totalTime)
basic.showString("seconds")
```

---

## 🔢 Example 6: Calculator

**What it does:** Add two numbers together!

```blocks
HalloweenKeypad.initialize()

basic.showString("Num 1?")
let num1 = HalloweenKeypad.waitForAnyKey()
basic.showNumber(num1)
basic.pause(500)

basic.showString("+")
basic.pause(500)

basic.showString("Num 2?")
let num2 = HalloweenKeypad.waitForAnyKey()
basic.showNumber(num2)
basic.pause(500)

basic.showString("=")
basic.pause(500)

let answer = num1 + num2
basic.showNumber(answer)
```

---

## 🎯 Example 7: Whack-a-Mole

**What it does:** Hit the right button before time runs out!

```blocks
HalloweenKeypad.initialize()

let score = 0
let lives = 3

function playRound() {
    let target = randint(1, 25)
    basic.showNumber(target)
    
    let startTime = input.runningTime()
    
    while (input.runningTime() - startTime < 2000) {
        let pressed = HalloweenKeypad.getLastKey()
        
        if (pressed == target) {
            score += 1
            music.playTone(523, 100)
            basic.showIcon(IconNames.Yes)
            return true
        }
        
        basic.pause(10)
    }
    
    // Time's up!
    lives -= 1
    music.playTone(131, 300)
    basic.showIcon(IconNames.No)
    return false
}

basic.showString("Whack!")
basic.pause(1000)

while (lives > 0) {
    playRound()
    basic.pause(300)
}

basic.showString("Score:")
basic.showNumber(score)
```

---

## 🎨 Example 8: Drawing Pad

**What it does:** Use the keypad like a drawing pad!

```blocks
HalloweenKeypad.initialize()

basic.showString("Draw!")

basic.forever(function () {
    let key = HalloweenKeypad.getLastKey()
    
    if (key > 0) {
        let row = HalloweenKeypad.getKeyRow(key) - 1
        let col = HalloweenKeypad.getKeyColumn(key) - 1
        led.plot(col, row)
        basic.pause(200)
    }
})

// Press button A to clear
input.onButtonPressed(Button.A, function () {
    basic.clearScreen()
})
```

---

## 🎃 Example 9: Halloween Trick-or-Treat

**What it does:** Get a random Halloween surprise!

```blocks
HalloweenKeypad.initialize()

let treats = [
    "Candy!",
    "Apple!",
    "Coin!",
    "Sticker!",
    "Toy!"
]

basic.showString("Trick or Treat!")
basic.showString("Press any button")

basic.forever(function () {
    HalloweenKeypad.waitForAnyKey()
    
    basic.showIcon(IconNames.Ghost)
    basic.pause(500)
    
    let surprise = treats[randint(0, treats.length - 1)]
    basic.showString(surprise)
    
    music.playMelody("C E G C5 E5", 120)
    basic.pause(1000)
})
```

---

## 🏆 Challenge Ideas

Try making these yourself!

1. **Simon Says** - Repeat the pattern the micro:bit shows
2. **Quiz Game** - Answer questions by pressing numbers
3. **Dance Machine** - Press buttons in rhythm with music
4. **Maze Runner** - Use buttons to navigate a maze
5. **Secret Message** - Each button is a letter (A-Z)
6. **Pet Feeder** - Press buttons to feed your digital pet
7. **Weather Station** - Different buttons show different weather
8. **Space Invaders** - Shoot aliens by pressing buttons

---

## 💡 Tips for Kids

- **Start simple!** Try the easy examples first
- **Change the numbers** - See what happens!
- **Mix examples** - Combine two games together
- **Add sounds** - Use `music.playTone()` for effects
- **Show your friends** - Make them guess how it works!
- **Ask for help** - Parents and teachers love helping!

---

## 🌈 Make It Your Own!

Change these things to make it more fun:
- **Speed** - Make games faster or slower
- **Difficulty** - More buttons = harder!
- **Sounds** - Add different music
- **Messages** - Change what the micro:bit says
- **Colors** - If you have NeoPixels, add lights!

---

**Have fun coding!** 🎉
