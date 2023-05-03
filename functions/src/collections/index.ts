import { admin } from "../config/firebase";

export enum COLLECTIONS {
  PORTFOLIO_ITEM = "PortfolioItem",
}

export const getPortfolio = async (userId: string) => {
  const data = await admin.firestore().collection(COLLECTIONS.PORTFOLIO_ITEM).where("userId", "==", userId).get();
  return data.docs[0].data();
};

export const addPortfolioItem = async (user: any, portfolio: any) => {
  const portfolioData = {
    ...user,
    userId: user.sub,
    portfolio,
    lastUpdated: admin.firestore.Timestamp.now(),
  };
  const data = await admin.firestore().collection(COLLECTIONS.PORTFOLIO_ITEM).where("userId", "==", user.sub).get();
  const docs = data.docs;
  if (docs.length) {
    const docId = docs[0].id;
    return admin.firestore().collection(COLLECTIONS.PORTFOLIO_ITEM).doc(docId).update(portfolioData);
  } else {
    return admin.firestore().collection(COLLECTIONS.PORTFOLIO_ITEM).add(portfolioData);
  }
};
