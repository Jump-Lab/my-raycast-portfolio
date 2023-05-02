import { Router } from "express";

import { getPortfolio } from "../collections"

const router = Router();

router.get('/health-check', (req, res) => {
  res.status(200).send('OK')
})

router.get('/portfolio',async (req, res) => {
  try {
    //@ts-ignore
    const portfolio = await getPortfolio(req.user.sub)
    console.log("Log ~ router.get ~ portfolio:", portfolio)
    res.status(200).send(portfolio);
  } catch (e) {
    console.log("Log ~ router.get ~ e:", e)
    res.status(500);
  }
})

router.post('/portfolio',async (req, res) => {
  try {
    //@ts-ignore
    const portfolio = await getPortfolio(req.user.uid)
    res.status(200).send(portfolio);
  } catch (e) {
    res.status(500);
  }
})

router.post('/port')

export default router;
