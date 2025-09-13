function updateClock () {
    const now = new Date();
    let hours = now.getHours();
    const meridiem = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    hours = hours.toString().padStart(2, 0);
    const minutes = now.getMinutes().toString().padStart(2, 0);
    const seconds = now.getSeconds().toString().padStart(2, 0);
    const timeString = `${hours}:${minutes}:${seconds} ${meridiem}`;
    return timeString;
};

const MOCK_DB = {
    // '65b4acc3-e58e-41c7-85d1-de7ac3328054': [
    //     // {
    //     //     id: 'tierList-id-1234',
    //     //     title: 'My Favorite Moves of All-time',
    //     //     description: 'My favorite movies ever',
    //     //     dateCreated: "7-23-25",
    //     //     lastUpdated: "",
    //     //     rows: [
    //     //         { id: 'row-s', label: 'S Tier', color: 'bg-pink-300', items: [] },
    //     //         { id: 'row-a', label: 'A Tier', color: 'bg-red-300', items: [] },
    //     //         { id: 'row-b', label: 'B Tier', color: 'bg-orange-300', items: [] },
    //     //         { id: 'row-c', label: 'C Tier', color: 'bg-yellow-300', items: [] },
    //     //     ],
    //     //     unranked: [
    //     //         { id: 'item-1', text: 'Godzilla' },
    //     //         { id: 'item-2', text: 'Kong' },
    //     //         { id: 'item-3', text: 'Ghidora' },
    //     //         { id: 'item-4', text: 'MUTO' },
    //     //         { id: 'item-5', text: 'Draken' },
    //     //         { id: 'item-6', text: 'Walu' },
    //     //         { id: 'item-7', text: 'Doha' },
    //     //         { id: 'item-8', text: 'Test-8' },
    //     //         { id: 'item-9', text: 'Test-9' },
    //     //         { id: 'item-10', text: 'Test-10' },
    //     //     ]
    //     // }
    // ]
};

async function handleGetUserLists (userId) {
    console.log(`[MOCK API]---Fetching lists for user: ${userId[0, 3]}`);

    const userLists = MOCK_DB[userId] || [];

    if (!userLists) {
        console.log(`[MOCK API]---Could NOT find lists for for user: ${userId[0, 3]}`);
    }

    return new Response(JSON.stringify(userLists), {
        headers: { 'Content-Type': 'application/json'},
    });
}

async function handleGetSpecificList (userId, listId) {
    const userLists = MOCK_DB[userId] || [];
    if (!userLists) {
        console.log(`[MOCK API]---Could NOT find lists for for user: ${userId[0, 3]}`);
    }
    const specificList = userLists.find(list => String(list.id) === String(listId));
    if (!specificList) {
        console.log('Could NOT find specific list! Returning...');
        return new Response ('Tier list not found', {
            status: 404,
            headers: { 'Content-Type': 'text/plain' },
        });
    } else {
        console.log(`[MOCK API]---Found list:`, specificList);
        return new Response(JSON.stringify(specificList), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

async function handleCreateNewList (userId, request) {
    console.log(`[MOCK API]---Saving lists for user: ${userId[0, 3]}`);

    const newListData = await request.json();

    if (!MOCK_DB[userId]) {
        MOCK_DB[userId] = [];
    }

    const newListId = `list-${Math.random().toString(36).substring(2, 9)}`;
    const timeStamp = new Date().toISOString();

    const newListToSave = { ...newListData, id: newListId, description: "N/A", dateCreated: timeStamp, lastUpdated: timeStamp, };

    MOCK_DB[userId].push(newListToSave);

    console.log(`[MOCK API]---Current data for user: ${userId[0, 3]}`, MOCK_DB[userId]);

    return new Response(JSON.stringify(newListToSave), {
        status: 201,
        headers: { 'Content-Type': 'application/json'},
    })
}

async function handleUpdateExisting (userId, listId, request) {
    console.log(`[MOCK API]---Updating list ${listId} for ${userId}`);
    const userLists = MOCK_DB[userId] || [];
    if (!userLists) {
        return new Response('User not found', {
            status: 404,
            headers: { 'Content-Type': 'text/plain' },
        });
    }
    console.log("userLists: ", userLists);

    const listIndex = userLists.findIndex(list => String(list.id) === String(listId));
    if (listIndex === -1) {
        return new Response('List not found', {
            status: 404,
            headers: { 'Content-Type': 'text/plain' },
        });
    }

    const timeStamp = new Date().toISOString();
    
    let updateData;
    try {
        updateData = await request.json();
    } catch (err) {
        throw new Response('Invalid JSON in request body', { status: 400 });
    }

    const originalList = userLists[listIndex];
    const updateList = { ...originalList, ...updateData, lastUpdated: timeStamp };
    if (JSON.stringify(originalList) === JSON.stringify(updateList)) {
        console.log("Original list is the same the new list data, returning");
        return;
    }

    userLists[listIndex] = updateList;

    return new Response(JSON.stringify(updateList), {
        status: 200,
        headers: { 'Content-Type': 'application/json'},
    });
};

async function handleDeleteList (userId, listId) {
    console.log(`[MOCK API]---Deleting list ${listId} for ${userId}`);
    const userLists = MOCK_DB[userId] || [];
    if (!userLists) {
        return new Response('User not found', {
            status: 404,
            headers: { 'Content-Type': 'text/plain' },
        });
    }
    console.log("userLists: ", userLists);

    const listIndex = userLists.findIndex(list => String(list.id) === String(listId));
    if (listIndex === -1) {
        return new Response('List not found', {
            status: 404,
            headers: { 'Content-Type': 'text/plain' },
        });
    }

    const updatedUserLists = userLists.filter(list => String(list.id) !== String(listId));

    MOCK_DB[userId] = updatedUserLists;

    console.log("Deletion successful. Current Lists: ", MOCK_DB[userId]);

    return new Response(null, {
        status: 204,
    });
};

export async function onRequest (context) {
    const { request, params } = context;
    const pathSegments = params.path || [];
    const userId = pathSegments[0];
    const listId = pathSegments[1];

    if (!userId) {
        return new Response('User Id is required.', { status: 400 });
    }

    if (request.method === 'GET') {
        
        if (listId) {
            return handleGetSpecificList(userId, listId);
        } else {
            return handleGetUserLists(userId);
        }
    }

    if (request.method === 'POST') {
        if (listId) {
            return new Response('Cannot POST to a specific source. Use PUT request method', { status: 400 });
        } else {
            return handleCreateNewList(userId, request);
        }
    }

    if (request.method === 'PUT') {
        if (!listId) {
            return new Response('Cannot PUT to a specific source without listId', { status: 400 });
        } else {
            return handleUpdateExisting(userId, listId, request);
        }
    }

    if (request.method === 'DELETE') {
        if (!listId) {
            return new Response('Cannot DELETE a specific source without listId', { status: 400 });
        } else {
            return handleDeleteList(userId, listId);
        }
    }

    return new Response('Method not allowed for this resource: ', {
        status: 405,
        headers: {
            'Allow': 'GET, POST, PUT',
        },
    })
}