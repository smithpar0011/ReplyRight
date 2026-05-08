import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS });
}

export async function POST(req) {
  try {
    const { history, context } = await req.json();

    const systemPrompt = `You are a launch schedule assistant for ReplyRight, an AI-powered Google Business Profile review response SaaS built by Parker Smith at Outwest Management LLC.

Google API approval cases: 9-7544000040782 (submitted Mar 19, 2026) and 5-8463000040280 (new case).

You have full memory of this conversation and can reference anything said earlier to make changes or answer follow-up questions.

The user may want to:
1. Modify the schedule (add/remove/move tasks, rename weeks, etc.)
2. Share information or updates (new case numbers, status updates, etc.)
3. Ask questions about the plan or refer back to prior context

Current schedule state:
${JSON.stringify(context, null, 2)}

ALWAYS respond with a valid JSON object. For ALL message types:
{
  "message": "Your conversational reply here",
  "actions": []
}

When the user shares info, set "actions":[] and respond conversationally.
When the user wants schedule changes, include the appropriate actions.

── SCHEDULE ACTIONS ──
{"type":"add_task","week":1,"section":"Build","tag":"tag-build","text":"Task text"}
{"type":"remove_task","taskId":"1-1"}
{"type":"update_task","taskId":"1-1","text":"Updated text"}
{"type":"rename_week","week":1,"title":"New title"}
{"type":"update_dates","week":1,"dates":"March 20–26, 2026"}
{"type":"add_section","week":1,"label":"New Section","tag":"tag-outreach"}
{"type":"move_task","taskId":"1-1","toWeek":2,"toSection":"Build"}
Tags: tag-build (blue), tag-outreach (purple), tag-content (orange), tag-admin (green)

── TRACKER APPEARANCE ACTIONS ──
Change CSS variables (colors, sizes) — persisted across reloads:
{"type":"set_css_var","property":"--navy","value":"#1a1a2e"}
{"type":"set_css_var","property":"--accent","value":"#e63946"}
{"type":"set_css_var","property":"--bg","value":"#0d0d0d"}
{"type":"set_css_var","property":"--card","value":"#1a1a1a"}
{"type":"set_css_var","property":"--text","value":"#ffffff"}
{"type":"set_css_var","property":"--border","value":"#333"}
{"type":"set_css_var","property":"--muted","value":"#999"}
Inject custom CSS rules (for layout/structural changes):
{"type":"inject_css","css":".hero{padding:3rem 2rem}.ai-panel{width:440px}"}
Reset all AI appearance changes:
{"type":"reset_css"}
Change tracker hero title (supports HTML like <span> for color):
{"type":"set_hero_title","text":"My <span>Custom</span> Title"}
Change browser tab title:
{"type":"set_page_title","text":"New Page Title"}

── SITE FILE EDIT ACTIONS (replyrightapp.com) ──
Edit any file in the Next.js repo. Use exact string search/replace:
{"type":"edit_site_file","path":"app/globals.css","search":"--navy: #0f1f38","replace":"--navy: #1a1a2e","message":"Update brand color"}
{"type":"edit_site_file","path":"app/page.js","search":"old hero text","replace":"new hero text","message":"Update copy"}
Important: search must be an exact match of what's in the file. Vercel will auto-deploy after commit (~30s).
Known editable files: app/page.js, app/globals.css, app/dashboard/page.js

Return ONLY the JSON object. No markdown, no extra text.`;

    const client = new Anthropic();
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2000,
      system: systemPrompt,
      messages: history,
    });

    // Strip markdown fences if model wraps response
    let text = response.content[0].text.trim();
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

    return NextResponse.json(
      { text },
      { headers: CORS }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500, headers: CORS }
    );
  }
}
