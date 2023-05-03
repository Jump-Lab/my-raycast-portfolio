import { Router } from "express";

import { getPortfolio, addPortfolioItem } from "../collections"

const router = Router();
router.get('/health-check', (req, res) => {
  res.status(200).send('OK')
})

router.get('/portfolio',async (req, res) => {
  try {
    //@ts-ignore
    const portfolio = await getPortfolio(req.user.sub)
    res.status(200).send(portfolio);
  } catch (e) {
    console.log("Log ~ router.get ~ e:", e)
    res.status(500);
  }
})

router.post('/portfolio',async (req, res) => {
  try {
    //@ts-ignore
    const result = await addPortfolioItem(req.user, req.body)
    console.log("Log ~ router.post ~ result:", result)
    res.status(200).send();
  } catch (e) {
    res.status(500);
  }
})

router.post('/port')

export default router;
