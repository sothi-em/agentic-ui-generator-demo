"""UI component generation workflow using Claude Agent SDK."""

from typing import Any, Dict

from claude_agent_sdk import ClaudeAgentOptions, query, tool


# Global storage for the latest generation result.
# Each call resets this before the agent loop so results are isolated.
_generated_files: Dict[str, str] = {
    "jsx": "",
    "css": "",
}


@tool(
    name="return_component_files",
    description=(
        "Saves and returns both the generated JSX and CSS strings back to the "
        "caller application."
    ),
    parameters={
        "jsx_content": str,
        "css_content": str,
    },
)
async def return_component_files(args: dict[str, Any]) -> dict[str, Any]:
    global _generated_files

    _generated_files["jsx"] = args["jsx_content"]
    _generated_files["css"] = args["css_content"]

    return {"content": [{"type": "text", "text": "Successfully received both files."}]}


def _build_system_prompt(
    user_prompt: str, existing_component: dict | None = None
) -> str:
    """Build the full system prompt, optionally including an existing component for context."""  # fmt: skip
    base_instruction = (
        "You are a specialized UI component generator. Your job is to output exactly one JSX file "
        "and one corresponding CSS file. Once they are ready, you MUST call the `return_component_files` "
        "tool with both string payloads. Do not attempt to use any other file-writing tools."
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

    return f"{base_instruction}{context_section}\n\nUser Request: {user_prompt}"


async def generate_ui_component(
    user_prompt: str,
    *,
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

    full_prompt = _build_system_prompt(user_prompt, existing_component)

    options = ClaudeAgentOptions(
        allowed_tools=["return_component_files"],
    )

    async for _message in query(full_prompt, options=options):
        pass

    return dict(_generated_files)