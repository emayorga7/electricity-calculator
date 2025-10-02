import { tiers } from "../constants/tiers";

export function calculateTotal(usage) {
  let FCV = 0, E01 = 0, CVC = 0, ENE = 0, IVE = 0, APU = 0, TCB = 0, CVP = 0;
  let remaining = usage;
  const newBreakdown = { FCV: [], E01: [], CVC: [], ENE: [], IVE: [], APU: [], TCB: [], CVP: [] };

  for (let i = tiers.length - 1; i >= 0; i--) {
    if (usage > tiers[i].min) {
      FCV = tiers[i].FCV;
      E01 = tiers[i].E01;
      newBreakdown.FCV.push({ range: `${tiers[i].min}-${tiers[i].max}`, value: FCV });
      newBreakdown.E01.push({ range: `${tiers[i].min}-${tiers[i].max}`, value: E01 });
      break;
    }
  }

  for (const tier of tiers) {
    if (remaining <= 0) break;
    const tierMin = tier.min;
    const tierMax = Math.min(tier.max, usage);
    const tierRange = Math.max(0, tierMax - tierMin + 1);

    if (usage >= tierMin) {
      const actualRange = Math.min(usage, tier.max) - tier.min + 1;
      const cvcStep = tier.CVC * actualRange;
      const eneStep = tier.ENE * actualRange;

      CVC += cvcStep;
      ENE += eneStep;

      newBreakdown.CVC.push({ range: `${tier.min}-${tier.max}`, value: cvcStep });
      newBreakdown.ENE.push({ range: `${tier.min}-${tier.max}`, value: eneStep });

      remaining -= actualRange;
    }
  }

  let bill = FCV + E01 + CVC + ENE;

  if (usage > 280) {
    IVE = 0.13 * (FCV + E01 + CVC + ENE);
  } else {
    IVE = 0.13 * (FCV + E01 + CVC);
  }
  newBreakdown.IVE.push({ range: "Total", value: IVE });
  bill += IVE;

  APU = 3.15 * usage;
  newBreakdown.APU.push({ range: "Total", value: APU });
  bill += APU;

  if (usage > 100) {
    TCB = 0.0215 * ENE;
    newBreakdown.TCB.push({ range: "Total", value: TCB });
    bill += TCB;
  }

  if (usage > 30) {
    CVP = 0.29 * usage;
    newBreakdown.CVP.push({ range: "Total", value: CVP });
    bill += CVP;
  }

  newBreakdown.FCV.amount = FCV;
  newBreakdown.E01.amount = E01;
  newBreakdown.CVC.amount = CVC;
  newBreakdown.ENE.amount = ENE;
  newBreakdown.IVE.amount = IVE;
  newBreakdown.APU.amount = APU;
  newBreakdown.TCB.amount = TCB;
  newBreakdown.CVP.amount = CVP;

  return { bill, breakdown: newBreakdown };

}
