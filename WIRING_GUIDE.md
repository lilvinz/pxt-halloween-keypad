# 🔌 Complete Wiring Guide: Matrix Keypad with Anti-Ghosting

## ⚠️ The Ghosting Problem

### What is Ghosting?

When you press **multiple keys simultaneously**, the matrix can register "ghost" keys that weren't actually pressed.

**Example:**
```
Press keys: 1 + 2 + 6
Ghost appears: Key 5 also registers!
```

**Why it happens:**
In a matrix without diodes, current can flow backwards through switches, creating false connections.

---

## 🛡️ The Solution: Diodes

### What You Need

**For a 5×5 matrix: 25 diodes**

**Recommended diodes:**
- **1N4148** - Fast switching, perfect for keyboards (most common)
- **1N914** - Alternative, works great
- **Any small signal diode** - 100mA+ rating

**Where to buy:**
- Amazon: "1N4148 diodes" (~$5 for 100)
- Electronic stores: Digikey, Mouser, local electronics shop
- Cost: ~$0.05 per diode

---

## 🔧 How to Wire It

### Basic Principle

**ONE diode per key switch, with cathode (stripe) toward the COLUMN and anode toward the ROW.**

```
Key Switch
    |
    |
   [D]  ← Diode (anode to row, cathode/stripe to column)
    |
    ↓
  ROW line (connects to the ANODE side)
```

### 5×5 Matrix Wiring Diagram

```
Columns (C0-C4) connect to TCA8418 Column pins
Rows (R0-R4) connect to TCA8418 Row pins

        C0      C1      C2      C3      C4
         |       |       |       |       |
R0 ─────●───────●───────●───────●───────●─────
        |       |       |       |       |
       [D]     [D]     [D]     [D]     [D]
        |       |       |       |       |
       [S1]    [S2]    [S3]    [S4]    [S5]
        
R1 ─────●───────●───────●───────●───────●─────
        |       |       |       |       |
       [D]     [D]     [D]     [D]     [D]
        |       |       |       |       |
       [S6]    [S7]    [S8]    [S9]    [S10]

... (same pattern for R2, R3, R4)

Legend:
[S]  = Switch (key button)
[D]  = Diode (1N4148)
─●─  = Wire connection to column
 |   = Wire connection to row
```

### Detailed Single Key Wiring

```
      Column wire (to TCA8418 column pin)
           |
           |
      ┌────┴────┐
      │  SWITCH │  ← Your key button
      │  [S13]  │
      └────┬────┘
           |
           |     Cathode (stripe)
          ┌┴┐         ↓
          │ │    ┌────|◄────┐
          │D│ =  │  DIODE   │  1N4148
          │ │    └────|►────┘
          └┬┘         ↑
           |      Anode (no stripe)
           |
      Row wire (to TCA8418 row pin)
```

**IMPORTANT:** The diode stripe (cathode marking) points TOWARD the column (switch/column side). The row connects to the ANODE side.

---

## 📐 Step-by-Step Assembly

### Method 1: DIY Matrix (Soldering)

#### Materials Needed:
- 25× tactile switches (12mm momentary push buttons)
- 25× 1N4148 diodes
- Perfboard or PCB
- Wire (22-24 AWG)
- Soldering iron & solder
- Wire strippers

#### Steps:

1. **Layout switches on perfboard** in 5×5 grid
   - Space them evenly (15-20mm apart recommended)

2. **Solder switches** to perfboard
   - Switches have 2 pins (or 4 pins where 2 pairs are connected)

3. **Add diodes to EACH switch:**
   ```
   Switch pin 1 ───[connects to column wire]
   Switch pin 2 ───[Diode]─── Row wire
                 (stripe/cathode toward SWITCH/COLUMN,
                  anode toward ROW)
   ```

4. **Wire columns (vertical):**
   - Connect all switches in same column together (one side of switch)
   - 5 wires total → TCA8418 C0-C4

5. **Wire rows (horizontal):**
   - Connect each ROW line to the ANODE side of all diodes in that row
   - 5 wires total → TCA8418 R0-R4

6. **Connect to TCA8418:**
   ```
   Matrix → TCA8418 Pin
   ─────────────────────
   C0 → Column 0
   C1 → Column 1
   C2 → Column 2
   C3 → Column 3
   C4 → Column 4
   R0 → Row 0
   R1 → Row 1
   R2 → Row 2
   R3 → Row 3
   R4 → Row 4
   ```

### Method 2: Pre-Made Keypad (Check Diodes!)

Some commercial keypads come with built-in diodes. Check the datasheet!

**How to test if your keypad has diodes:**

1. Use a multimeter in diode mode
2. Test between any row and column
3. Should read ~0.6V in one direction, open in other
4. If reads short (0Ω) both ways = NO diodes → add them!

---

## 🔌 TCA8418 Connection Pinout

### Full Connection Map

```
micro:bit → TCA8418 Breakout Board
────────────────────────────────────
P19 (SCL) → SCL  (I²C Clock)
P20 (SDA) → SDA  (I²C Data)
P2        → INT  (Interrupt - optional but recommended)
3V        → VCC  (Power 3.3V)
GND       → GND  (Ground)

Keypad Matrix → TCA8418 Breakout Board
───────────────────────────────────────
Column 0 → C0 (or GPIO0)
Column 1 → C1 (or GPIO1)
Column 2 → C2 (or GPIO2)
Column 3 → C3 (or GPIO3)
Column 4 → C4 (or GPIO4)
Row 0    → R0 (or GPIO5)
Row 1    → R1 (or GPIO6)
Row 2    → R2 (or GPIO7)
Row 3    → R3 (or GPIO8)
Row 4    → R4 (or GPIO9)
```

**Note:** Some TCA8418 boards label pins as GPIO0-GPIO9. The typical mapping is:
- GPIO0-4 = Columns 0-4
- GPIO5-9 = Rows 0-4

---

## 🧪 Testing Your Matrix

### Test 1: Single Key Press

```blocks
HalloweenKeypad.initialize()
basic.forever(function () {
    basic.showNumber(HalloweenKeypad.getLastKey())
})
```

**Expected:** Pressing one key shows its number (1-25)

### Test 2: Ghosting Check

```blocks
HalloweenKeypad.initialize()
let count = 0

basic.forever(function () {
    let key = HalloweenKeypad.getLastKey()
    if (key > 0) {
        count += 1
        basic.showNumber(count)
    }
})
```

**Test:** Press keys 1, 2, and 6 simultaneously
- **With diodes:** Count = 3 (only 3 keys detected)
- **Without diodes:** Count = 4+ (ghost key 5 also detected)

### Test 3: Multi-Key Roll-Over (NKRO)

With diodes, you can press multiple keys and all will register correctly!

```blocks
HalloweenKeypad.initialize()

basic.forever(function () {
    for (let i = 1; i <= 25; i++) {
        if (HalloweenKeypad.isKeyPressed(i)) {
            led.plot(i % 5, Math.floor(i / 5))
        } else {
            led.unplot(i % 5, Math.floor(i / 5))
        }
    }
})
```

---

## 🛒 Shopping List

### For Complete Build:

| Item | Quantity | Approx Cost |
|------|----------|-------------|
| TCA8418 Breakout Board | 1 | $8-15 |
| Tactile switches (12mm) | 25 | $5-10 |
| 1N4148 diodes | 25 (buy 100) | $5 |
| Perfboard | 1 | $3 |
| Wire 22AWG | 1 spool | $5 |
| Jumper wires (F-F) | 10 | $5 |
| micro:bit v2 | 1 | $20 |
| **Total** | | **~$50-60** |

### Alternative: Pre-Made Options

**Option A:** Buy a membrane keypad (check for diodes!)
- 4×4 membrane keypad: $3-5
- **Problem:** Most are 4×4, you need 5×5

**Option B:** Mechanical keyboard switches
- Cherry MX style switches: $0.50-1.00 each
- Requires 3D printed or laser-cut plate
- Professional feel, great for kids!

---

## ⚡ Common Issues

### Issue 1: "Some keys don't work"

**Check:**
- ✅ Diode orientation (stripe toward column!)
- ✅ Solder joints (cold solder = bad connection)
- ✅ Wire connections to TCA8418
- ✅ Switch is actually working (test with multimeter)

### Issue 2: "Ghost keys still appear"

**Causes:**
- ❌ Forgot diode on one or more switches
- ❌ Diode installed backwards
- ❌ Row/column wires crossed

**Debug:** Test each key individually, note which ones cause ghosts

### Issue 3: "No keys work at all"

**Check:**
- ✅ I²C connections (P19/P20)
- ✅ Power (3.3V to TCA8418)
- ✅ `initialize()` called in code
- ✅ TCA8418 address is 0x34 (default)

---

## 🎓 Understanding the Physics

### Why Diodes Work

**Diodes allow current flow in ONE direction only:**

```
Current CAN flow:    Anode → Cathode (→|)
Current CANNOT flow: Cathode → Anode (|←)
```

**In the matrix:**
- TCA8418 scans by energizing one column at a time
- Reads which rows are connected
- Diodes prevent backflow through other keys
- Result: Only actual pressed keys register!

**Without diodes (conceptually, columns low / rows read):**
```
Press keys 1 & 2 & 6:

  C0   C1   C2
   |    |    |
R0─●────●────●  Press S1 & S2
   S1   S2   S3
   
R1─●────●────●  Press S6
   S6   S7   S8
   
Current can flow:
C0 → R0 → C1 (keys 1,2 pressed)
BUT ALSO:
C1 → R0 → C0 → R1 → C1 (ghost path!)
This creates false detection at S7!
```

**With diodes (anode at row → cathode at column):**
```
Current blocked by diodes in reverse direction
No ghost paths possible! ✅
```

---

## 👨‍👩‍👧‍👦 Kid-Friendly Explanation

**For your 8-year-old:**

"A diode is like a one-way street for electricity. When we press multiple buttons, we don't want electricity to sneak through the wrong way and trick the computer into thinking we pressed extra buttons. The diode says 'nope, you can only go THIS direction!' So the computer only sees the buttons we actually pressed!"

---

## 📚 Additional Resources

- **TCA8418 Datasheet:** [TI Website](https://www.ti.com/product/TCA8418)
- **Diode Basics:** SparkFun Diode Tutorial
- **Matrix Keypad Theory:** Dave Jones EEVblog video
- **PCB Design:** KiCad tutorial for custom keypad PCB

---

## ✅ Final Checklist

Before connecting to micro:bit:

- [ ] All 25 switches installed
- [ ] All 25 diodes installed (stripe toward column!)
- [ ] All column wires connected (C0-C4)
- [ ] All row wires connected (R0-R4; connect to diode ANODES)
- [ ] I²C wires ready (SCL/SDA/GND/VCC)
- [ ] Optional: IRQ wire (P2)
- [ ] Tested continuity with multimeter
- [ ] No shorts between rows or columns
- [ ] Ready to program!

---

**Good luck with your Halloween Box! 🎃**

Questions? Check the parent guide or open an issue on GitHub!
