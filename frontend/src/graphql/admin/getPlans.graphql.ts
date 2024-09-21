import { gql } from "@apollo/client";

const AdminPlansQuery = gql`
  query AdminGetPlans {
    adminPlans {
      id
      name
      quotaMax
      color
      internalName
      icon
    }
  }
`;
