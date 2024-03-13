import { gql } from "@apollo/client";

export const AdminPlansQuery = gql`
  query AdminGetPlans {
    adminPlans {
      id
      name
      quotaMax
      price
      features
      color
      internalName
      purchasable
      internalFeatures
      icon
    }
  }
`;
