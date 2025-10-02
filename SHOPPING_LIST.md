# 🛒 Shopping List: Halloween Keypad Project

## Essential Components

### 1. TCA8418 Keypad Controller
**What:** I²C keypad controller chip on breakout board  
**Quantity:** 1  
**Price:** $8-15  

**Where to buy:**
- Amazon: Search "TCA8418 breakout board"
- AliExpress: ~$5-8 (longer shipping)
- Adafruit/SparkFun: May have similar boards

**Alternative:** Some boards use the TCA8418E (automotive grade) - works the same!

---

### 2. Diodes (CRITICAL!)
**Part Number:** 1N4148 or 1N914  
**Quantity:** 25 minimum (buy 50-100 for spares)  
**Price:** $3-5 per 100  

**Specifications:**
- Type: Small signal switching diode
- Voltage: 100V
- Current: 200mA
- Package: DO-35 (through-hole)

**Where to buy:**
- Amazon: "1N4148 diodes 100 pack"
  - Example: Chanzon 1N4148 100pcs (~$5)
- Digikey: Part# 1N4148-ND
- Mouser: Part# 512-1N4148
- Local electronics store

**⚠️ DO NOT substitute with:**
- ❌ LEDs (wrong direction, wrong specs)
- ❌ Zener diodes (different purpose)
- ❌ Power diodes (too slow for keyboard)

---

### 3. Tactile Switches (Buttons)
**What:** Momentary push button switches  
**Quantity:** 25  
**Price:** $5-10 for 25  

**Recommended specs:**
- Size: 12mm × 12mm (most common)
- Type: Tactile momentary
- Pins: 4-pin (2 pairs internally connected)
- Actuation force: 160-260gf
- Travel: 0.25mm

**Where to buy:**
- Amazon: "12mm tactile switches"
  - Example: DAOKI 100pcs 12x12x7.3mm (~$8)
- AliExpress: Very cheap (~$2 for 50)
- Local electronics store

**Alternative options:**
- **Mechanical switches:** Cherry MX, Gateron, Kailh ($0.50-1/each)
  - Need mounting plate
  - More durable, better feel
  - Great for older kids!
  
- **Membrane keypad:** Pre-made 4×4 or custom 5×5
  - Check if diodes included!
  - Usually sealed/waterproof

---

### 4. Perfboard / PCB
**What:** Board to mount components  
**Quantity:** 1  
**Price:** $3-5  

**Options:**

**A) Perfboard (easiest):**
- Size: 7cm × 9cm minimum
- Type: Standard 2.54mm (0.1") spacing
- Through-hole plated recommended

**B) Breadboard (prototyping only):**
- ⚠️ Not recommended for final project
- Keys can disconnect easily
- Good for testing first!

**C) Custom PCB (advanced):**
- Design in KiCad/EasyEDA
- Order from JLCPCB/PCBWay
- Cost: ~$10 for 5 boards
- Takes 1-2 weeks

---

### 5. Wire
**Type:** Solid core or stranded  
**Gauge:** 22-24 AWG  
**Quantity:** ~10 meters total  
**Price:** $5-8  

**Recommended colors:**
- Red: Columns
- Blue: Rows  
- Yellow: I²C (SDA/SCL)
- Black: GND
- Red (thicker): VCC

**Pre-crimped jumper wires:**
- Female-to-Female: 10-20 pieces
- For connecting TCA8418 to micro:bit

---

### 6. micro:bit v2
**Quantity:** 1  
**Price:** $17-20  

Must be **v2** (has I²C pins we need)!

**Where to buy:**
- micro:bit official store
- Amazon
- Educational suppliers

---

### 7. Connectors (Optional but Recommended)

**JST connectors** for keypad matrix:
- Makes it removable
- Easier to debug
- Professional look
- $5-10 for set

**Dupont connectors:**
- Alternative to JST
- Easier to crimp
- Standard on jumper wires

---

## Tools Required

### Essential:
- ✅ Soldering iron (25-40W) - $15-30
- ✅ Solder (60/40 or lead-free) - $8-12
- ✅ Wire strippers - $8-15
- ✅ Wire cutters / flush cutters - $8-15
- ✅ Multimeter - $15-30 (essential for testing!)

### Nice to have:
- 🔧 Helping hands / PCB holder - $10-20
- 🔧 Solder sucker / wick (for mistakes) - $5-10
- 🔧 Magnifying glass - $10-20
- 🔧 Heat shrink tubing - $5
- 🔧 Cable management - $5

---

## Cost Breakdown

### Budget Build (DIY Everything):
| Item | Cost |
|------|------|
| TCA8418 board (AliExpress) | $6 |
| 1N4148 diodes (100) | $4 |
| Tactile switches (50) | $5 |
| Perfboard | $3 |
| Wire assortment | $6 |
| Jumper wires | $4 |
| micro:bit v2 | $18 |
| **Total** | **~$46** |

### Standard Build (Amazon/Local):
| Item | Cost |
|------|------|
| TCA8418 board | $12 |
| 1N4148 diodes (100) | $5 |
| Tactile switches (100) | $8 |
| Perfboard | $4 |
| Wire kit | $8 |
| Jumper wires | $6 |
| micro:bit v2 | $20 |
| **Total** | **~$63** |

### Premium Build (Mechanical Keys):
| Item | Cost |
|------|------|
| TCA8418 board | $12 |
| 1N4148 diodes | $5 |
| Cherry MX switches (30) | $20 |
| Custom PCB (JLCPCB × 5) | $12 |
| Keycaps | $10 |
| Wire & connectors | $10 |
| micro:bit v2 | $20 |
| **Total** | **~$89** |

---

## Tool Investment (If You Don't Have):

### Minimum tools:
- Soldering iron kit - $25
- Multimeter - $20
- Wire tools - $15
- **Total: ~$60**

### Good quality tools (will last years):
- Hakko/Weller soldering station - $80
- Fluke/Klein multimeter - $50
- Professional wire tools - $30
- **Total: ~$160**

**Note:** If building with kids, invest in good tools. They'll use them for years!

---

## Where to Buy (Summary)

### 🚚 Fast Shipping (1-3 days):
- **Amazon** - Good prices, fast, easy returns
- **Local electronics store** - Support local, immediate
- **Adafruit/SparkFun** - Quality guaranteed, tutorials

### 💰 Cheapest (2-4 weeks):
- **AliExpress** - Very cheap, long shipping
- **Banggood** - Similar to AliExpress
- **LCSC** - Great for bulk components

### 🎓 Educational Suppliers:
- **Kitronik** - micro:bit specialist
- **Pimoroni** - UK-based, quality kits
- **Seeed Studio** - Maker-friendly

---

## Pre-Made Kit Options

**Don't want to source parts separately?**

### Option 1: Buy similar keypad project
Search for "Arduino 4×4 matrix keypad kit" - modify for 5×5

### Option 2: Membrane keypad
- Cheaper
- Less durable
- Check for built-in diodes!
- Usually needs adapter PCB

### Option 3: Custom order
Some PCB manufacturers offer assembly:
- Upload design
- They assemble everything
- Ships ready to plug in
- Cost: $50-100 assembled

---

## Bulk Orders (For Teachers/Makerspaces)

Building **10+ units**? Discounts available!

### Buy in bulk:
- TCA8418: $5-6 each (10+)
- Diodes: $2 per 100 (1000+)
- Switches: $0.10 each (500+)
- PCBs: $1-2 each (100+)

**Contact suppliers for education/bulk pricing!**

---

## Sustainability Note ♻️

- Buy quality switches - they'll last 10+ years
- Use lead-free solder if possible
- Salvage diodes from old electronics
- Perfboard is reusable if you desolder carefully
- Consider mechanical switches for longevity

---

## ✅ Pre-Purchase Checklist

Before ordering:

- [ ] Verified TCA8418 board has I²C interface
- [ ] Checked diodes are 1N4148 (not LEDs!)
- [ ] Confirmed switches are momentary (not latching)
- [ ] Measured perfboard size fits 5×5 layout
- [ ] micro:bit is version 2 (not v1)
- [ ] Have or will buy soldering equipment
- [ ] Multimeter for testing
- [ ] Enough wire in different colors
- [ ] Optional: JST connectors for clean build

---

## 🎃 Ready to Order?

1. **Start with essentials:** TCA8418, diodes, switches, perfboard
2. **Order tools** if you don't have them
3. **Get micro:bit** last (can test with simulator first)
4. **Buy extras** of diodes and switches (mistakes happen!)

---

**Total project time:** 3-5 hours for first build  
**Skill level:** Beginner-intermediate soldering  
**Age recommendation:** Adults or teens 14+ (soldering required)  
**Kid involvement:** 6-8 year olds can help test and program!

---

**Questions about parts? Check the [PARENT_GUIDE.md](PARENT_GUIDE.md)!**
