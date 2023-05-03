import { doc, setDoc } from "firebase/firestore";
import { admin, db } from "../config/firebase";

export enum COLLECTIONS {
  PORTFOLIO_ITEM = "PortfolioItem",
}

export const getPortfolio = async (userId: string) => {
  const data = await admin.firestore().collection(COLLECTIONS.PORTFOLIO_ITEM).where("userId", "==", userId).get();
  return data.docs[0].data();
};

export const addPortfolioItem = async (userId: string, portfolio: any) => {
  const portfolioData = {
    portfolio,
    userId,
    lastUpdated: admin.firestore.Timestamp.now(),
  };
  console.log("Log ~ addPortfolioItem ~ portfolioData:", portfolioData)
  const data = await admin.firestore().collection(COLLECTIONS.PORTFOLIO_ITEM).where("userId", "==", userId).get();
  console.log("Log ~ addPortfolioItem ~ data:", data);
  const docs = data.docs;
  console.log("Log ~ addPortfolioItem ~ data:", docs);
  if (docs.length) {
    const docId = docs[0].id;
    console.log("Log ~ addPortfolioItem ~ docId:", docId);
    return admin.firestore().collection(COLLECTIONS.PORTFOLIO_ITEM).doc(docId).update(portfolioData);
  } else {
    return admin.firestore().collection(COLLECTIONS.PORTFOLIO_ITEM).add(portfolioData);
  }
};
