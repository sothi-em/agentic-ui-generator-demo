"""UI component generation workflow using Claude Agent SDK."""
import json
from typing import Any, Dict
import asyncio
from claude_agent_sdk import ClaudeAgentOptions, query, tool, ResultMessage
from pydantic import BaseModel, Field


# Define the structured output schema
class UIComponentResponse(BaseModel):
    jsx: str = Field(description="The complete, modern, and responsive JSX code for the component.")
    css: str = Field(description="The corresponding CSS code containing animations and layout styles.")


def _build_system_prompt(
    existing_component: dict | None = None
) -> str:
    """Build the full system prompt, optionally including an existing component for context."""  # fmt: skip
    base_instruction = (
        "You are a specialized UI component generator. Your job is to output exactly one JSX file "
        "and one corresponding CSS file. Once they are ready, you MUST call the `return_component_files` "
        "tool with both string payloads. Do not attempt to use any other file-writing tools."
        "Use only builtin standard library and styling. You MUST name the jsx function App."
    )

    context_section = ""
    if existing_component:
        context_section = (
            "\n\nThe user is editing an existing component. Here is the current component context:\n"
            f"- Name: {existing_component.get('name', 'N/A')}\n"
            f"- Description: {existing_component.get('description', '')}\n"
            f"- Current JSX:\n```jsx\n{existing_component.get('appJsx', '')}\n```\n"
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
        If provided, the existing component (name, description, appJsx, indexCss)
        is inserted as context so the agent modifies it rather than creating from scratch.

    Returns
    -------
    dict
        ``{"jsx": "...", "css": "..."}`` with the generated file contents.
    """
    global _generated_files
    _generated_files = {"jsx": "", "css": ""}

    system_prompt = _build_system_prompt(existing_component)

    options = ClaudeAgentOptions(
        output_format={
            "type": "json_schema",
            "schema": UIComponentResponse.model_json_schema()
        },
        system_prompt=system_prompt,
        # MUST ENABLE SO THE FRONT END REQUEST CANNOT READ ANY FILES
        allowed_tools=[],  # Disable all tools including Read and Bash
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
            "jsx": final_response.get("jsx", ""),
            "css": final_response.get("css", "")
        }

    return {"jsx": "", "css": ""}


# --- Example Usage ---
async def main():
    prompt = "Display a list of current directory files and content."
    files = await generate_ui_component(prompt)

    print("--- GENERATED JSX ---")
    print(files["jsx"])

    print("\n--- GENERATED CSS ---")
    print(files["css"])


if __name__ == "__main__":
    asyncio.run(main())