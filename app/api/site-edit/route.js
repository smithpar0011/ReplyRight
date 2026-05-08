import { NextResponse } from 'next/server';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const OWNER = 'smithpar0011';
const REPO = 'replyright';
const BRANCH = 'main';

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS });
}

export async function POST(req) {
  try {
    const { path, search, replace, message } = await req.json();

    if (!path || !search || replace === undefined) {
      return NextResponse.json({ error: 'path, search, and replace are required' }, { status: 400, headers: CORS });
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500, headers: CORS });
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    };

    // Get current file content + sha
    const getRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`,
      { headers }
    );
    if (!getRes.ok) {
      const err = await getRes.json();
      return NextResponse.json({ error: `Could not fetch file: ${err.message}` }, { status: 400, headers: CORS });
    }
    const fileData = await getRes.json();
    const currentContent = Buffer.from(fileData.content, 'base64').toString('utf8');

    if (!currentContent.includes(search)) {
      return NextResponse.json({ error: `Search string not found in ${path}` }, { status: 400, headers: CORS });
    }

    const newContent = currentContent.replace(search, replace);
    const newContentB64 = Buffer.from(newContent).toString('base64');

    // Commit the change
    const putRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: message || `AI tracker edit: ${path}`,
          content: newContentB64,
          sha: fileData.sha,
          branch: BRANCH,
        }),
      }
    );

    if (!putRes.ok) {
      const err = await putRes.json();
      return NextResponse.json({ error: `Commit failed: ${err.message}` }, { status: 500, headers: CORS });
    }

    return NextResponse.json({ success: true, path }, { headers: CORS });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: CORS });
  }
}
