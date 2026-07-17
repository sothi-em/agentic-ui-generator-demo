"""UI component generation workflow using Claude Agent SDK."""
import asyncio
from typing import Dict
import tempfile
from claude_agent_sdk import ClaudeAgentOptions, query, ResultMessage
from pydantic import BaseModel, Field


# Define the structured output schema
class UIComponentResponse(BaseModel):
    tsx: str = Field(description="The complete, modern, and responsive TSX code for the component with TypeScript types.")


def _build_system_prompt(
    existing_component: dict | None = None
) -> str:
    """Build the full system prompt, optionally including an existing component for context."""  # fmt: skip
    base_instruction = (
        "You are a specialized UI component generator. Your job is to output exactly one App.tsx "
        "file with self-contained CSS styling and proper TypeScript types. Use TypeScript for all "
        "props, state variables, event handlers, and imports. Use only the built-in standard library "
        "and styling. You MUST name the TSX function App and use this signature: "
        "export default function App(): JSX.Element. Always include this line: "
        "import items from './data.json';. Do not include any stub test data unless the user specifies. "
        "Before returning your response in the structured output format, mentally compile the TSX code "
        "and perform a rigorous syntax check to ensure there are no compilation, typing, or syntax errors."

    )

    context_section = ""
    if existing_component:
        context_section = (
            "\n\nThe user is editing an existing component. Here is the current component context:\n"
            f"- Name: {existing_component.get('name', 'N/A')}\n"
            f"- Description: {existing_component.get('description', '')}\n"
            f"- Current TSX:\n```tsx\n{existing_component.get('appTsx', '')}\n```\n"
            f"- Current CSS:\n```css\n{existing_component.get('indexCss', '')}\n```"
            "\n\nModify the existing component based on the user's request."
        )

    return f"{base_instruction}{context_section}\n\n"


async def generate_ui_component(
    user_prompt: str,
    existing_component: dict | None = None,
) -> Dict[str, str]:
    """Run the Claude Agent SDK workflow to generate or modify a UI component.

    Parameters
    ----------
    user_prompt : str
        The user's natural-language description of the component.
    existing_component : dict, optional
        If provided, the existing component (name, description, appTsx, indexCss)
        is inserted as context so the agent modifies it rather than creating from scratch.

    Returns
    -------
    dict
        ``{"jsx": "..."}`` with the generated file contents.
    """
    system_prompt = _build_system_prompt(existing_component)

    with tempfile.TemporaryDirectory() as temp_dir:
        options = ClaudeAgentOptions(
            cwd=temp_dir,
            output_format={
                "type": "json_schema",
                "schema": UIComponentResponse.model_json_schema()
            },
            system_prompt=system_prompt,
            # MUST ENABLE SO THE FRONT END REQUEST CANNOT READ ANY FILES
            # allowed_tools=[],  # Disable all tools including Read and Bash
            disallowed_tools=['Bash'],
            mcp_servers=[],
            permission_mode="dontAsk"
        )

        final_response = None
        # Execute the agent loop
        async for message in query(prompt=user_prompt, options=options):
            print(message)
            # The final ResultMessage yields when the task succeeds
            if isinstance(message, ResultMessage) and message.structured_output:
                final_response = message.structured_output
        if final_response:
            return {
                "tsx": final_response.get("tsx", "")
            }

    return {"tsx": ""}


# --- Example Usage ---
async def main():
    prompt = "Give me a blue button that when click turn into a red button"
    files = await generate_ui_component(prompt)

    print("--- GENERATED TSX ---")
    print(files["tsx"])

if __name__ == "__main__":
    asyncio.run(main())