// your-app-name/src/fetchGraphQL.js
async function fetchGraphQL(text: string, variables: any) {
  console.log(text, variables);
  const response = await fetch("/graphql", {
    method: "POST",
    headers: {
      //Authorization: `bearer ${REACT_APP_GITHUB_AUTH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: text,
      variables,
    }),
  });

  // Get the response as JSON
  const jsonResponse = await response.json();
  //console.log("fetchGraphQL json response", jsonResponse);
  if (jsonResponse.errors) {
    console.error(jsonResponse.errors);
  }
  return jsonResponse;
}

export default fetchGraphQL;
