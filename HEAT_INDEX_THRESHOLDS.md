# Heat Index Thresholds & DOLE Guidelines

This document outlines the **Heat Index (Apparent Temperature)** thresholds used in the QC Heat Risk Monitor, based on PAGASA / NWS standards and adapted for the Philippine Department of Labor and Employment (DOLE) safety protocols.

## What is the Heat Index?
The Heat Index is what the temperature *feels like* to the human body when relative humidity is combined with the air temperature. High humidity prevents sweat from evaporating efficiently, making it feel significantly hotter than the actual temperature.

---

## 🟢 SAFE (Normal)
**Heat Index: Below 27°C**

The environmental conditions are completely normal and comfortable. The body's natural cooling mechanisms (sweating) work efficiently. 

- **Health Risk:** Minimal to none.
- **Work / Rest Schedule:** 60 min Work / Standard Rest.
- **DOLE Protocol:** `✅ NORMAL CONDITIONS`. Heat Index is within safe limits. Standard work schedule applies. Stay hydrated as a precaution.
- **Visuals in App:** Clean, cool environment. No heat haze, no sweat.

---

## 🟡 CAUTION
**Heat Index: 27°C – 31°C**

Mild heat stress begins. The body starts working harder to cool down, especially under direct sunlight or physical exertion.

- **Health Risk:** Fatigue is possible with prolonged exposure and activity. Continuing activity could result in heat cramps.
- **Work / Rest Schedule:** 45 min Work / 15 min Rest.
- **DOLE Protocol:** `⚠️ [Subject] must drink water every 20 min. Wear light clothing. Seek shade during breaks.`
- **Visuals in App:** Slight golden tint to the environment. Minor heat particles appear.

---

## 🟠 EXTREME CAUTION
**Heat Index: 32°C – 40°C**

Significant heat stress risk. It is noticeably uncomfortable, and working outdoors without precautions is hazardous.

- **Health Risk:** Heat cramps and heat exhaustion are possible. Continuing activity could result in heat stroke.
- **Work / Rest Schedule:** 30 min Work / 30 min Rest.
- **DOLE Protocol:** `⚠️ [Subject]: Limit strenuous activity. Mandatory shade breaks every 30 min. DOLE D.O. 102-10 applies.`
- **Visuals in App:** Visible heat distortion (wavy air). Distinct sweat drops appear on characters. Noticeable heat haze lines.

---

## 🔴 DANGER
**Heat Index: 41°C – 53°C**

Severe heat stress. The body struggles to regulate its temperature. Immediate cooling interventions are required.

- **Health Risk:** Heat cramps or heat exhaustion are *likely*. Heat stroke is possible with prolonged exposure and activity.
- **Work / Rest Schedule:** 15 min Work / 45 min Rest.
- **DOLE Protocol:** `⚠️ DOLE Protocol: [Subject] allowed 15 min work / 45 min rest. Provide cold water & cooling area immediately.`
- **Visuals in App:** Deep orange, aggressive heat shimmer. Characters sweat heavily and may be shown pouring water to cool down. Floating heat embers visible.

---

## 🚨 EXTREME DANGER
**Heat Index: 54°C and above**

Life-threatening heat condition. The body cannot cool itself down, and organ damage or death can occur without immediate intervention.

- **Health Risk:** Heat stroke is highly likely.
- **Work / Rest Schedule:** FULL STOP (No Work).
- **DOLE Protocol:** `🚨 HALT ALL OUTDOOR OPERATIONS. Evacuate [Subject] to air-conditioned facility. Call emergency services NOW.`
- **Visuals in App:** Burnt orange/red atmospheric haze. Intense pulsing danger vignettes. Maximum heat distortion and sweat.

---

## Calculation Formula Reference
The system calculates the Heat Index using the **Rothfusz Regression Equation**, customized to default safely when temperatures drop below 27°C or humidity falls below 40% (since apparent temperature is roughly equal to ambient temperature in these ranges). The formula caps the simulated heat index at 70°C, as the human body and the mathematical model both break down beyond this point.
