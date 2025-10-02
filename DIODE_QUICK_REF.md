# ⚡ Quick Reference: Diode Installation

## 🎯 Remember This ONE Thing

```
                STRIPE (CATHODE) GOES TO COLUMN
                                 ↓
    
    Switch ──┬── Column wire
             │
            ┌┴┐
            │▓│ ← Diode body
            │▓│
            │▓│
            └┬┘
             │  ← Stripe/band here (toward column)
             │
            Row wire (ANODE side)
```

---

## 🔍 Diode Identification

### 1N4148 Diode Markings

```
Physical diode:
     
  ═══════════════
  ║  BLACK     ║
  ║  BAND  ←───║─── This is the CATHODE
  ║  HERE      ║     (stripe/ring)
  ═══════════════
       ↑
    Anode (plain end)
```

**Color:** Usually glass body with black band
**Size:** About 3-4mm long, 2mm diameter

---

## 📋 Per-Key Checklist

For EACH of your 25 keys:

```
✓ Step 1: Solder switch to board
✓ Step 2: Identify which side connects to COLUMN
✓ Step 3: Identify which side connects to ROW  
✓ Step 4: Add diode with STRIPE toward ROW side
✓ Step 5: Test continuity in one direction only
```

---

## 🧮 Quick Math

**5 rows × 5 columns = 25 keys**
**Each key needs 1 diode**
**Total: 25 diodes**

Buy **50 or 100** so you have spares for mistakes!

---

## ⚠️ Common Mistakes

### ❌ WRONG: Stripe toward row
```
Column ──── [|►] ──── Row
            WRONG!
```

### ✅ RIGHT: Stripe toward column
```
Column ──── [◄|] ──── Row
            RIGHT!
```

---

## 🔬 How to Test Diode Direction

**Use multimeter in DIODE mode:**

1. **Correct direction:** Reads ~0.6V (diode conducts)
2. **Reverse direction:** Reads "OL" or infinite (diode blocks)
3. **Both ways read 0Ω:** Diode is SHORTED (bad!)
4. **Both ways open:** Diode is BROKEN (bad!)

**Test AFTER soldering each diode!**

---

## 🎨 Color-Coded Wiring (Optional)

To make debugging easier, use colored wires:

- **Red:** Columns 0-4
- **Blue:** Rows 0-4  
- **Yellow:** I²C (SDA/SCL)
- **Green:** IRQ
- **Black:** GND
- **Red (thicker):** VCC

---

## 🆘 Emergency Debug

**If ghosting still happens:**

1. Press **ONLY** keys 1 and 6
2. Does key 2 also light up? → Check diode on key 2
3. Does key 5 also light up? → Check diode on key 5
4. Does key 11 light up? → Check diode on key 11

**Pattern:** Ghosts appear at row-column intersections

---

## 📐 Visual Key Layout Reminder

```
[ 1] [ 2] [ 3] [ 4] [ 5]    Row 0
[ 6] [ 7] [ 8] [ 9] [10]    Row 1
[11] [12] [13] [14] [15]    Row 2
[16] [17] [18] [19] [20]    Row 3
[21] [22] [23] [24] [25]    Row 4
 ↑
Col 0-4
```

Each key needs its own diode!

---

## 🔧 Tools You'll Need

- [ ] Soldering iron (25-40W)
- [ ] Solder (60/40 or 63/37)
- [ ] Wire strippers
- [ ] Wire cutters (for diode legs)
- [ ] Multimeter
- [ ] Helping hands (soldering jig)
- [ ] Good lighting
- [ ] Ventilation (solder fumes)

---

## ⏱️ Time Estimate

- **First-time builder:** 2-3 hours
- **Experienced:** 1 hour
- **With kids helping:** 3-4 hours (but more fun!)

**Break it up over multiple sessions!**

---

## 🎓 Quick Diode Physics

**Diode = One-Way Valve for Electricity**

```
Water Analogy:

  ╔════╗     ╔════╗
  ║ ►  ║     ║  ◄ ║
  ║ →  ║     ║  ← ║
  ║ ►  ║     ║  ◄ ║
  ╚════╝     ╚════╝
  Flows!     Blocked!
```

Just like water can only flow one way through a valve!

---

## ✅ Success Indicators

**You did it right when:**

- ✅ All 25 keys respond individually
- ✅ Can press multiple keys without ghosts
- ✅ No random key presses when idle
- ✅ Consistent response every time
- ✅ Works in all the example programs

---

**Print this page and keep it on your workbench!** 📄🔧
