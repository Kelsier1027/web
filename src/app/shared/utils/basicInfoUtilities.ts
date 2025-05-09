export const ORG_ID = {
  getOrgName(): string {
    switch (localStorage.getItem('orgId')) {
      case "151":
        return "精豪電腦";
      case "83":
      default:
        return "精技電腦";
    }
  }
}