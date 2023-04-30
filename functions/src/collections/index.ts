import { admin } from "../config/firebase";

export enum COLLECTIONS {
  PORTFOLIO_ITEM = "PortfolioItem",
}

export const getPortfolio = async (userId: string) => {
  return admin.firestore().collection(COLLECTIONS.PORTFOLIO_ITEM).where("userId", "in", userId).get();
};

export const addPortfolioItem = async (item: any) => {
  return admin
    .firestore()
    .collection(COLLECTIONS.PORTFOLIO_ITEM)
    .add({ ...item, createdAt: admin.firestore.Timestamp.now() });
};
