export async function onRequest (context) {
    const API_TOKEN = context.env.MY_API_TOKEN;

    if (!API_TOKEN) {
        return new Response('API access token is not configured', { status: 500 });
    }

    const path = context.params.path.join('/');
    const url = new URL(context.request.url);
    const queryString = url.search;

    const apiUrl = `https://api.themoviedb.org/3/${path}${queryString}`;
    console.log(`Forwarding request to: ${apiUrl}`);

    try {
        const apiResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'accept': 'application/json',
            },
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            return new Response(errorText, { status: apiResponse.status });
        }

        return new Response(apiResponse.body, {
            headers: apiResponse.headers,
            status: apiResponse.status,
        });

    } catch (error) {
        console.error('Error fetching from TMDB API:', error);
        return new Response('Error fetching from external API', { status: 500 });
    }
}