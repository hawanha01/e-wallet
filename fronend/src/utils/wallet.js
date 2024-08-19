import axios from "axios";

export const getCurrentUserWalletBalance = async (user) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/wallet/balance?userID=${user.user.id}`
    );
    if (response.data.success) {
      return response.data.wallet;
    }
  } catch (e) {
    return `Wallet Not Found: ${e.message}`;
  }
};
