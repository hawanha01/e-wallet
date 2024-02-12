import axios from "axios";

export const getCurrentUserWalletBalance = async (user) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/wallet/balance?userID=${user.user._id}`
    );
    if (response.data.success) {
      return response.data.wallet;
    }
  } catch (e) {
    return `Wallet Not Found: ${e.message}`;
  }
};
