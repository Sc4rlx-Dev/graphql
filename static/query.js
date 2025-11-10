export function query() {
  return `
{
  user {
    id
    login
    email
    lastName
    firstName
    avatarUrl
    auditRatio
    campus
    xps {
      amount
      path
    }
    transactions(
      order_by: [{ type: desc }, { amount: desc }]
      distinct_on: [type]
      where: {
        type: { _like: "skill_%" }
      }
    ) {
      type
      amount
    }
  }
}
`};


export const GET_XP = `{
  transaction_aggregate(
    where: {type: {_eq: "xp"}, eventId: {_eq: 41}}
    order_by: {createdAt: desc}
  ) {
    aggregate {
      sum {
        amount
      }
    }
  }
}`;