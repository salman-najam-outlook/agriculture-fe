const actions = {
  async changePassword({ commit }, { newPassword, confirmPassword }) {
    try {
      const response = await axios.put('/api/admin/user/change-password', {
        newPassword,
        confirmPassword
      })
      
      if (response.data.success) {
        return response.data
      } else {
        throw new Error(response.data.message || 'Failed to change password')
      }
    } catch (error) {
      throw error.response?.data || error
    }
  }
} 