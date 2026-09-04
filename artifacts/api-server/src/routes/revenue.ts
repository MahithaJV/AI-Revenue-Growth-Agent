import { Router, type IRouter } from "express";
import {
  AnalyzeGoalBody,
  AnalyzeGoalResponse,
  CalculateOfferBody,
  CalculateOfferResponse,
  CreateRazorpayTestOrderBody,
  CreateRazorpayTestOrderResponse,
  GetAnalyticsResponse,
  GetDashboardResponse,
  GetRulesResponse,
  ListActivityResponse,
  ListCatalogResponse,
  MerchantRules,
  UpdateRulesBody,
  UpdateRulesResponse,
} from "@workspace/api-zod";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unitsSold: number;
  revenue: number;
  attachRate: number;
  trend: "up" | "down" | "flat";
  accent: string;
};

const products: Product[] = [
  {
    id: "run-elite",
    name: "AeroRun Elite",
    category: "Running shoes",
    price: 128,
    stock: 42,
    unitsSold: 384,
    revenue: 49152,
    attachRate: 23,
    trend: "up",
    accent: "coral",
  },
  {
    id: "pace-socks",
    name: "PaceForm Socks",
    category: "Accessories",
    price: 18,
    stock: 216,
    unitsSold: 286,
    revenue: 5148,
    attachRate: 0,
    trend: "up",
    accent: "mint",
  },
  {
    id: "tempo-bottle",
    name: "Tempo Hydration Flask",
    category: "Accessories",
    price: 26,
    stock: 94,
    unitsSold: 174,
    revenue: 4524,
    attachRate: 14,
    trend: "flat",
    accent: "blue",
  },
  {
    id: "trail-shell",
    name: "TrailShield Shell",
    category: "Outerwear",
    price: 94,
    stock: 31,
    unitsSold: 72,
    revenue: 6768,
    attachRate: 9,
    trend: "down",
    accent: "violet",
  },
  {
    id: "recovery-gel",
    name: "Recovery Fuel Gel",
    category: "Nutrition",
    price: 12,
    stock: 428,
    unitsSold: 198,
    revenue: 2376,
    attachRate: 0,
    trend: "up",
    accent: "yellow",
  },
];

let rules = {
  maxDiscountPercent: 10,
  minMarginPercent: 35,
  maxOfferValue: 1500,
  requireApproval: true,
  testModeOnly: true,
};

const activity: Array<{
  id: string;
  timestamp: string;
  action: string;
  detail: string;
  status: "success" | "running" | "blocked" | "failed";
  tool: string;
}> = [
  {
    id: "activity-1",
    timestamp: "2026-09-03T08:42:00.000Z",
    action: "Recommendation approved",
    detail: "Bundle offer for AeroRun Elite + PaceForm Socks is within the 10% discount limit.",
    status: "success" as const,
    tool: "Offer calculator",
  },
  {
    id: "activity-2",
    timestamp: "2026-09-03T08:40:00.000Z",
    action: "Sales signal detected",
    detail: "23% of AeroRun Elite buyers also purchase PaceForm Socks.",
    status: "success" as const,
    tool: "Sales analytics",
  },
  {
    id: "activity-3",
    timestamp: "2026-09-03T08:39:00.000Z",
    action: "Catalog synced",
    detail: "5 products and 1,284 order records are ready for analysis.",
    status: "success" as const,
    tool: "Product catalog",
  },
  {
    id: "activity-4",
    timestamp: "2026-09-03T08:36:00.000Z",
    action: "Test order blocked",
    detail: "No external Razorpay connection is active; sandbox adapter kept the request local.",
    status: "blocked" as const,
    tool: "Razorpay test mode",
  },
];

const pairings = [
  {
    primaryProduct: "AeroRun Elite",
    secondaryProduct: "PaceForm Socks",
    primaryId: "run-elite",
    secondaryId: "pace-socks",
    attachRate: 23,
    revenuePotential: 2360,
    signal: "Strongest attach opportunity",
  },
  {
    primaryProduct: "AeroRun Elite",
    secondaryProduct: "Tempo Hydration Flask",
    primaryId: "run-elite",
    secondaryId: "tempo-bottle",
    attachRate: 14,
    revenuePotential: 1180,
    signal: "Useful race-day add-on",
  },
  {
    primaryProduct: "TrailShield Shell",
    secondaryProduct: "Recovery Fuel Gel",
    primaryId: "trail-shell",
    secondaryId: "recovery-gel",
    attachRate: 9,
    revenuePotential: 420,
    signal: "Emerging pairing",
  },
];

const router: IRouter = Router();

function productById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

function recommendedPair(productId: string): {
  primary: Product;
  secondary: Product;
} {
  const primary = productById(productId) ?? products[0];
  const pairing = pairings.find((item) => item.primaryId === primary.id);
  const secondary = productById(pairing?.secondaryId ?? "pace-socks") ?? products[1];
  return { primary, secondary };
}

function offerFor(primary: Product, secondary: Product, requestedDiscountPercent: number) {
  const approvedDiscountPercent = Math.min(
    requestedDiscountPercent,
    rules.maxDiscountPercent,
  );
  const withinLimit =
    requestedDiscountPercent <= rules.maxDiscountPercent &&
    secondary.price * (approvedDiscountPercent / 100) <= rules.maxOfferValue;
  const status = withinLimit
    ? "approved"
    : approvedDiscountPercent > 0
      ? "capped"
      : "blocked";
  const estimatedOfferValue =
    secondary.price * (approvedDiscountPercent / 100) * 100;
  const estimatedRevenueLift = Math.round(
    secondary.price * 100 * (approvedDiscountPercent > 0 ? 0.23 : 0),
  );

  return {
    primaryProductId: primary.id,
    secondaryProductId: secondary.id,
    primaryProduct: primary.name,
    secondaryProduct: secondary.name,
    requestedDiscountPercent,
    approvedDiscountPercent,
    withinLimit,
    estimatedRevenueLift,
    estimatedOfferValue,
    explanation: withinLimit
      ? `${approvedDiscountPercent}% stays within the ${rules.maxDiscountPercent}% merchant limit and the $${rules.maxOfferValue.toLocaleString()} offer-value ceiling.`
      : `The requested discount was capped at ${approvedDiscountPercent}% by the merchant rules.`,
    status,
  } as const;
}

router.get("/dashboard", (_req, res): void => {
  res.json(
    GetDashboardResponse.parse({
      revenue: 68240,
      revenueChange: 12.8,
      orders: 1284,
      ordersChange: 8.4,
      averageOrderValue: 53.14,
      aovChange: 4.1,
      opportunityValue: 3960,
      activeOpportunities: 3,
      topProduct: "AeroRun Elite",
      conversionRate: 4.8,
      periodLabel: "Last 30 days",
    }),
  );
});

router.get("/catalog", (_req, res): void => {
  res.json(ListCatalogResponse.parse(products));
});

router.get("/analytics", (_req, res): void => {
  res.json(
    GetAnalyticsResponse.parse({
      salesByDay: [
        { label: "Aug 28", revenue: 1840, orders: 36 },
        { label: "Aug 29", revenue: 2190, orders: 42 },
        { label: "Aug 30", revenue: 1980, orders: 39 },
        { label: "Aug 31", revenue: 2450, orders: 48 },
        { label: "Sep 01", revenue: 2310, orders: 44 },
        { label: "Sep 02", revenue: 2670, orders: 52 },
        { label: "Sep 03", revenue: 2840, orders: 55 },
      ],
      pairings,
      categoryMix: [
        { category: "Running shoes", revenue: 49152, share: 72, color: "#f07f68" },
        { category: "Outerwear", revenue: 6768, share: 10, color: "#8377d8" },
        { category: "Accessories", revenue: 9672, share: 14, color: "#4dbfa3" },
        { category: "Nutrition", revenue: 2648, share: 4, color: "#e6b94f" },
      ],
    }),
  );
});

router.get("/activity", (_req, res): void => {
  res.json(ListActivityResponse.parse(activity));
});

router.get("/rules", (_req, res): void => {
  res.json(GetRulesResponse.parse(rules));
});

router.put("/rules", (req, res): void => {
  const parsed = UpdateRulesBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  rules = parsed.data;
  activity.unshift({
    id: `activity-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: "Guardrails updated",
    detail: `Discount limit set to ${rules.maxDiscountPercent}% with a ${rules.minMarginPercent}% minimum margin.`,
    status: "success",
    tool: "Merchant rules",
  });
  res.json(UpdateRulesResponse.parse(rules));
});

router.post("/offers/calculate", (req, res): void => {
  const parsed = CalculateOfferBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const primary = productById(parsed.data.primaryProductId);
  const secondary = productById(parsed.data.secondaryProductId);
  if (!primary || !secondary) {
    res.status(400).json({ error: "One or both products could not be found." });
    return;
  }
  res.json(CalculateOfferResponse.parse(offerFor(primary, secondary, parsed.data.requestedDiscountPercent)));
});

router.post("/agent/analyze", (req, res): void => {
  const parsed = AnalyzeGoalBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { primary, secondary } = recommendedPair(
    parsed.data.productId ?? "run-elite",
  );
  const baseTrace = [
    {
      step: 1,
      tool: "catalog.search",
      label: "Read product catalog",
      status: "complete" as const,
      detail: `Matched ${primary.name} and ${secondary.name} in the active catalog.`,
      durationMs: 184,
    },
    {
      step: 2,
      tool: "sales.analytics",
      label: "Find purchase patterns",
      status: parsed.data.simulateFailure ? ("failed" as const) : ("complete" as const),
      detail: parsed.data.simulateFailure
        ? "Sales analytics timed out; no customer pattern was assumed."
        : `Found a ${primary === products[0] ? "23%" : "14%"} attach rate for the strongest pairing.`,
      durationMs: parsed.data.simulateFailure ? 5000 : 312,
    },
    {
      step: 3,
      tool: "recommendation.rank",
      label: "Rank revenue opportunity",
      status: parsed.data.simulateFailure ? ("blocked" as const) : ("complete" as const),
      detail: parsed.data.simulateFailure
        ? "Blocked until analytics returns verified purchase data."
        : "Cross-sell has the best balance of relevance, stock, and expected lift.",
      durationMs: 128,
    },
    {
      step: 4,
      tool: "offer.calculate",
      label: "Check offer guardrails",
      status: parsed.data.simulateFailure ? ("blocked" as const) : ("complete" as const),
      detail: parsed.data.simulateFailure
        ? "Skipped because the opportunity signal was not verified."
        : `A 5% bundle is inside the ${rules.maxDiscountPercent}% discount limit.`,
      durationMs: 96,
    },
    {
      step: 5,
      tool: "razorpay.test_mode",
      label: "Prepare sandbox action",
      status: parsed.data.simulateFailure ? ("blocked" as const) : ("complete" as const),
      detail: parsed.data.simulateFailure
        ? "No order action taken after the upstream failure."
        : "Prepared a local test-mode action; no real payment was created.",
      durationMs: 74,
    },
  ];

  if (parsed.data.simulateFailure) {
    const failed = {
      id: `analysis-${Date.now()}`,
      goal: parsed.data.goal,
      status: "failed" as const,
      recommendation: "I could not make a verified recommendation because sales analytics failed.",
      headline: "Analysis paused safely",
      confidence: 0,
      expectedLift: 0,
      discountPercent: 0,
      primaryProduct: primary.name,
      secondaryProduct: secondary.name,
      primaryProductId: primary.id,
      secondaryProductId: secondary.id,
      reasoning: "The agent stopped after the analytics tool failed. It did not infer a pairing or fabricate a revenue estimate.",
      trace: baseTrace,
    };
    activity.unshift({
      id: failed.id,
      timestamp: new Date().toISOString(),
      action: "Analysis paused safely",
      detail: "Sales analytics failed; no recommendation was fabricated.",
      status: "failed",
      tool: "Agent orchestrator",
    });
    res.json(AnalyzeGoalResponse.parse(failed));
    return;
  }

  const offer = offerFor(primary, secondary, 5);
  const analysis = {
    id: `analysis-${Date.now()}`,
    goal: parsed.data.goal,
    status: "complete" as const,
    recommendation: `${primary.attachRate || 23}% of customers who purchase ${primary.name} also purchase ${secondary.name}. I recommend a ${offer.approvedDiscountPercent}% bundle offer, which is within your ${rules.maxDiscountPercent}% discount limit.`,
    headline: `${secondary.name} is your clearest next sale`,
    confidence: 0.91,
    expectedLift: offer.estimatedRevenueLift,
    discountPercent: offer.approvedDiscountPercent,
    primaryProduct: primary.name,
    secondaryProduct: secondary.name,
    primaryProductId: primary.id,
    secondaryProductId: secondary.id,
    reasoning: `The agent found a verified ${primary.attachRate || 23}% attach signal, checked stock availability, ranked the pairing against other opportunities, and applied the merchant's ${rules.maxDiscountPercent}% discount guardrail.`,
    trace: baseTrace,
  };
  activity.unshift({
    id: analysis.id,
    timestamp: new Date().toISOString(),
    action: "Revenue recommendation generated",
    detail: `${primary.name} + ${secondary.name}: ${offer.approvedDiscountPercent}% bundle offer.`,
    status: "success",
    tool: "Agent orchestrator",
  });
  res.json(AnalyzeGoalResponse.parse(analysis));
});

router.post("/razorpay/test-order", (req, res): void => {
  const parsed = CreateRazorpayTestOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const primary = productById(parsed.data.productId);
  const secondary = productById(parsed.data.companionProductId);
  if (!primary || !secondary) {
    res.status(400).json({ error: "One or both products could not be found." });
    return;
  }

  const amount = Math.round(
    (primary.price + secondary.price) * (1 - parsed.data.discountPercent / 100) * 100,
  );
  const testOrder = {
    id: `order_test_${Date.now()}`,
    provider: "Razorpay test-mode adapter",
    mode: "test" as const,
    status: "created" as const,
    amount,
    currency: "INR",
    displayAmount: `₹${(amount / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
    note: "Local sandbox preview only. No external Razorpay request was sent because no connection is active.",
    createdAt: new Date().toISOString(),
  };
  activity.unshift({
    id: `activity-${Date.now()}`,
    timestamp: testOrder.createdAt,
    action: "Sandbox order prepared",
    detail: `${testOrder.displayAmount} test-mode bundle preview created locally.`,
    status: "success",
    tool: "Razorpay test mode",
  });
  res.status(201).json(CreateRazorpayTestOrderResponse.parse(testOrder));
});

export default router;