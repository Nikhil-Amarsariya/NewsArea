exports.handler = async function (event) {
  try {
    const category =
      event.queryStringParameters.category || "general";

    const country =
      event.queryStringParameters.country || "us";

    const page =
      event.queryStringParameters.page || 1;

    const pageSize =
      event.queryStringParameters.pageSize || 6;

    const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=${country}&max=${pageSize}&page=${page}&apikey=${process.env.GNEWS_API}`;

    const response = await fetch(url);

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};