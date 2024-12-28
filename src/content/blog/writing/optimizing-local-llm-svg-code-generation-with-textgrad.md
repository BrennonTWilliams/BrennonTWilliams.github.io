---
title: Optimizing Local LLM SVG Code Generation with TextGrad
date: 2024-12-27
author: Brennon Williams
description: An exploration of using TextGrad to improve SVG generation with local LLMs
tags: ["LLM", "TextGrad", "SVG", "Machine Learning"]
---

I recently switched from the excellent DSPy framework to TextGrad. Like DSPy, TextGrad uses example inputs and outputs as training data to refine prompts and improve outputs. Unlike DSPy, though, there is no emphasis on prompt templating, and the Optimizers can be applied to more than just a re-usable prompt.

The TextGrad whitepaper describes two types of optimizations we can apply:
1. Instance optimization - Directly optimize a solution to a problem like a code snippet or a generated report
2. Prompt optimization - find a prompt that improves the performance of an LLM across multiple queries for a task. We can optimize at the system-prompt or the user-prompt level.

TextGrad ended up being far more intuitive than I expected - especially as someone who's used PyTorch since college. So why isn't TextGrad more popular?

Some of the examples TextGrad offers - Drug discovery through molecular modeling, radiation treatment dosage optimizations - create an impression that TextGrad is more complex than it actually is, or that it is only useful for highly specialized fields. But TextGrad's elegance lies in its simplicity. At its core, TextGrad uses LLM-as-judge feedback to guide the refinement of text. It uses abstractions similar to those found in pytorch like loss functions and Optimizers. But unlike Pytorch, TextGrad doesn't require a huge training dataset that takes weeks or months to prepare.

## The Gradient Descent Analogy

TextGrad's approach is inspired by Gradient Descent, a foundational concept in machine learning. I can still recall the first lecture I attended on Gradient Descent my sophomore year of college. The professor of most of the Machine Learning courses I took, the incomparable Simon Levy, explained it like this:

> Imagine a marble on a hill. The height of our marble represents the loss function, or the error in our model's predictions. Our marble considers a small step in different directions, and based on the slope (gradient) it encounters, chooses the steepest direction to "move" (update our model's weights). This descent down the hill continues until the marble reaches a valley, representing the minimum loss – a model that makes accurate predictions.

The TextGrad framework uses a conceptually similar approach to refine text generation models. Instead of a marble on a hill, think of it as a word sequence being adjusted. The "loss function" measures how well this sequence aligns with the desired output, as determined by another LLM acting as a judge. TextGrad then iteratively tweaks each word in the sequence, guided by the "gradient" – the direction of change that minimizes the loss.

![TextGrad Overview](/images/blog/textgrad-svg/textgrad_overview.png)

I now use TextGrad in most of my LLM projects. It streamlines the process of refining outputs, allowing me to iterate quickly and achieve impressive results without manually creating sets of inputs and outputs for training.

## Optimizing SVG Code Generation

This weekend I endeavored to make a less serious example of a TextGrad project. LLMs are really, really bad at generating SVG code. This felt like a great opportunity to experiment with TextGrad and see if I could coax an LLM into producing something resembling a described prompt.

I've learned to keep my weekend projects tightly scoped, lest I get sucked into an all-consuming rabbit holes. If this were a "real" project, I'd try a more complex approach like:
- Start from a minimalist Image Gen of the input, use a Sobel edge filter and extract basic shapes and paths, and use these extracted elements in my TG Optimizer.
- I've wanted to play around with LLM-generated ASCII art more. Starting from an ASCII representation of the input and using TextGrad to refine it into a stylized SVG image could lead to more consistent results.

But, for this weekend project, I opted for a simpler approach. We use this flow with TextGrad:
- Forward pass: prompt -> model -> svg_output -> evaluator -> evaluation
- Backward pass: evaluation.backward() propagates gradients through the entire graph
- Optimizer step: Updates parameters using the computed gradients

So what do each of these steps actually look like?

### Forward Pass
*Takes the input text (our prompt + any dynamic inputs) and generates output text (our SVG code), and evaluates it using our loss function.*
- prompt: A Variable containing our SVG generation instructions
- model: The BlackboxLLM that takes the prompt and generates SVG code
- svg_output: The generated SVG code as a Variable
- evaluator: The TextLoss that assesses the SVG based on our criteria
- evaluation: The resulting score and feedback as a Variable

### Backward Pass
*Generates improvement feedback by critiquing outputs against defined criteria, using our Evaluator. Then, propagates this feedback through the computation graph.*
- evaluation.backward() tells TextGrad to compute how each word/token in our prompt influenced the final evaluation score
- LLM call to analyze this influence by asking it to explain the relationships between inputs and outputs
- This creates a computational graph showing how changes in the prompt would affect the final score

### Optimizer Step
*Calls our LLM to implement the feedback from our Backward Pass to improve our variables*
- optimizer.step() uses the computed gradients to modify our prompt
- Attempts words/phrases changes to (hopefully) improve the evaluation score
- optimizer.zero_grad() clears the gradients for the next iteration

The remarkable thing about TextGrad, is that the optimization is done in natural language. Our optimizations use this prompt, which required a bit of tweaking to get the best results:

```text
Evaluate the SVG code using this weighted criteria system:

            1. Technical Correctness (40%):
            - Proper viewBox attribute usage
            - Valid path commands and attribute values
            - Efficient use of SVG elements
            - Clean group structure

            2. Style Requirements (30%):
            - Black and white color scheme only
            - Transparent background
            - Stroke width consistency
            - Appropriate level of detail

            3. Adherence to Description (30%):
            - Adherence to the provided description
            - Accuracy in representing the subject
            - Includes all elements specified in the description

            CRITICAL: Your evaluation MUST end with exactly this line:
            Final Score: [number] / 100

            Do not use any other score format. Do not add "Weighted" or change the format.
```

Like with many of my LLM projects, we use local models (`qwen2.5-coder:32b-instruct-q6_K` here) and generate a descriptive markdown file showing our iterations and progress.

We could very well use different models for feedback and generation (and I've even split them out in the project code), but for the sake of simplicity we use the same model for both.

## Results

Our test prompt is `Create a SVG of an 1800s-era British explorer`.

This is our first result without any optimizations. See what I mean when I say LLMs stink at writing SVG code? *This* is supposed to be an image of an explorer...

<svg width=100 height=100 viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M50 10 C60 10 70 20 70 30 L70 40 C70 50 60 60 50 60 C40 60 30 50 30 40 L30 30 C30 20 40 10 50 10 Z" fill="black"/>
  <path d="M45 30 L55 30 M47.5 28 L52.5 28" stroke="black" stroke-width="2"/>
  <path d="M46 40 C46 42 48 44 50 44 C52 44 54 42 54 40 L53 40 C53 41.5 51.5 43 50 43 C48.5 43 47 41.5 47 40 Z" fill="black"/>
  <path d="M42 60 L58 60 M45 58 L55 58" stroke="black" stroke-width="2"/>
</svg>

Now let's look at our final SVG output after running our optimization iterations:

<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="background-color: transparent;">
    <!-- Face -->
    <g id="face">
        <!-- Head -->
        <circle cx="50" cy="40" r="20" fill="none" stroke="black" stroke-width="2"/>
        <!-- Eyes -->
        <circle cx="43" cy="36" r="1.5" fill="black"/>
        <circle cx="57" cy="36" r="1.5" fill="black"/>
        <!-- Mouth -->
        <path d="M45 48 Q50 52 55 48" stroke="black" stroke-width="2" fill="none"/>
    </g>
    <!-- Clothing -->
    <g id="clothing">
        <!-- Coat -->
        <rect x="30" y="60" width="40" height="20" fill="none" stroke="black" stroke-width="2"/>
        <!-- Buttons on Coat -->
        <circle cx="45" cy="65" r="1" fill="black"/>
        <circle cx="45" cy="70" r="1" fill="black"/>
        <circle cx="45" cy="75" r="1" fill="black"/>
        <!-- Top Hat -->
        <rect x="45" y="10" width="10" height="15" fill="none" stroke="black" stroke-width="2"/>
        <path d="M45 25 Q50 30 55 25" stroke="black" stroke-width="2" fill="none"/>
    </g>
    <!-- Accessories -->
    <g id="accessories">
        <!-- Walking Stick -->
        <line x1="75" y1="80" x2="90" y2="60" stroke="black" stroke-width="2"/>
        <!-- Compass -->
        <circle cx="25" cy="85" r="5" fill="none" stroke="black" stroke-width="2"/>
        <path d="M25 80 L25 90 M20 85 L30 85" stroke="black" stroke-width="2"/>
    </g>
</svg>

Sure, our final SVG may not be at the level of DALL-E or Flux, but it's undeniably better than the initial generation. It's discernibly a person!

Our little explorer has the visual fidelity of a stick figure drawing, and isn't terribly useful in a production setting. But it shows the level of improvement you can get out of TextGrad without fine-tuning, or creating massive sets of example inputs and outputs.

We also optimized our prompt, which we could easily carry into other projects:

```python
You are an expert SVG graphics generator tasked with creating high-quality vector graphics. Your primary objectives are:

1. **Technical Correctness**:
   - Ensure all SVG elements (rectangles, circles, paths, etc.) are valid and properly formatted.
   - Use the `viewBox` attribute to define the coordinate system (`viewBox="0 0 100 100"`) and include `preserveAspectRatio="xMidYMid meet"` for consistent scaling across different viewports.
   - Utilize precise path commands such as quadratic Bezier curves (`Q`) or arcs (`A`) where appropriate, especially for detailed elements like compass needles.

2. **Style Consistency**:
   - Adhere to a black and white color scheme only.
   - Maintain a transparent background using `fill="none"` and `stroke="black"`.
   - Use consistent stroke widths throughout the SVG, but consider introducing subtle variations in stroke width (e.g., slightly thicker lines for highlights) to add depth or highlight specific parts of the illustration.

3. **Adherence to Description**:
   - Include all elements specified in the description and position them accurately.
   - Ensure that the representation is accurate and recognizable as the subject described.

4. **Maintainability**:
   - Use logical grouping (`<g>`) for related elements, ensuring each group has a descriptive `id` attribute (e.g., `<g id="explorer">`, `<g id="top-hat">`, etc.).
   - Add comments to explain the purpose of each group and significant elements within the SVG for better clarity and maintainability.

5. **Visual Quality**:
   - Enhance details where possible, such as refining the compass needle using arcs or quadratic curves.
   - Consider adding subtle visual effects like shadows or highlights to improve depth and realism without compromising simplicity.

6. **Additional Suggestions**:
   - Ensure all paths are optimized for performance.
   - Validate the SVG code against W3C standards to ensure compatibility across different browsers and platforms.

By following these guidelines, generate an SVG that meets the specified requirements while maintaining high visual quality and technical accuracy.
```

## Full Implementation

Here's the complete code:

```python
import textgrad as tg
from textgrad import Variable, BlackboxLLM, TextLoss, TGD
from textgrad.engine.local_model_openai_api import ChatExternalClient
import logging
import datetime
from typing import Optional, Tuple
import re
from tqdm import tqdm

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class SVGPromptTuner:
    def _create_optimization_prompt(self, description: str) -> Variable:
        """Creates an optimizable prompt with constraints"""
        return Variable(
            description,
            requires_grad=True,
            role_description="detailed SVG generation prompt with specific requirements"
        )

    def _setup_optimizer(self, prompt: Variable) -> TGD:
        """Creates optimizer with advanced features"""
        return TGD(
            parameters=[prompt, self.system_prompt],
            constraints=[
                "Maintain SVG best practices",
                "Use only black and white colors",
                "Use a transparent background",
                "Use a simple style",
                "Use a 100x100 size",
            ],
            gradient_memory=3,
            verbose=1
        )

    def _validate_svg(self, svg_str: str) -> Tuple[bool, Optional[str]]:
        """Enhanced SVG validation"""
        if not svg_str or not isinstance(svg_str, str):
            return False, "Empty or invalid SVG string"

        # Remove any XML or code block markers
        svg_str = svg_str.replace('```xml', '').replace('```svg', '').replace('```', '').strip()

        # Add detailed debug logging
        logger.debug(f"Raw SVG string length: {len(svg_str)}")
        logger.debug(f"First 50 chars: {repr(svg_str[:50])}")
        logger.debug(f"Last 50 chars: {repr(svg_str[-50:])}")

        # Clean up the input string
        svg_str = svg_str.strip()

        # Find all SVG tag pairs
        start_indices = []
        end_indices = []
        pos = 0

        while True:
            svg_start = svg_str.find('<svg', pos)
            if svg_start == -1:
                break

            svg_end = svg_str.find('</svg>', svg_start)
            if svg_end == -1:
                return False, "Unclosed SVG tag found"

            start_indices.append(svg_start)
            end_indices.append(svg_end + 6)  # include the length of </svg>
            pos = svg_end + 6

        if not start_indices:
            return False, "No SVG tags found"

        # Fail if multiple SVGs are found
        if len(start_indices) > 1:
            return False, f"Multiple SVG tags found ({len(start_indices)} SVGs). Only one SVG per response is allowed."

        # Extract the single SVG
        svg_str = svg_str[start_indices[0]:end_indices[0]]
        logger.debug(f"Selected SVG: {repr(svg_str)}")

        # Basic attribute checks
        required_attrs = ['viewBox', 'xmlns']
        for attr in required_attrs:
            if attr not in svg_str:
                return False, f"Missing required attribute: {attr}"

        return True, None

    def optimize_svg(self, description: str, num_iterations: int = 3, allow_early_stop: bool = False) -> str:
        """Runs the optimization process with tracking"""
        try:
            start_time = datetime.datetime.now()
            prompt = self._create_optimization_prompt(description)
            optimizer = self._setup_optimizer(prompt)

            output_md = "# SVG Optimization with TextGrad\n\n"
            best_score = float('-inf')
            best_svg = None

            # Add progress bar
            with tqdm(total=num_iterations, desc="Optimizing SVG") as pbar:
                for i in range(num_iterations):
                    logger.info(f"Starting iteration {i+1}/{num_iterations}")
                    output_md += f"\n## Iteration {i+1} of {num_iterations}\n"

                    # Generate SVG
                    svg_output = self.model(prompt)
                    output_md += f"\n #### SVG Generated: \n```svg\n{svg_output.value}\n```\n"

                    # Validate SVG
                    is_valid, error_msg = self._validate_svg(svg_output.value)
                    if not is_valid:
                        logger.error(f"Invalid SVG generated: {error_msg}")
                        output_md += f"\n #### Validation Failed \n ##### SVG Error: \n```bash\n{error_msg}\n```\n"
                        continue

                    # Evaluate and compute gradients
                    evaluation = self.evaluator(svg_output)
                    output_md += f"\n ##### Full Evaluation: \n```\n{evaluation.value}\n```\n"

                    # Extract score and update best result
                    try:
                        score_patterns = [
                            r"Final Score:\s*(\d+(?:\.\d+)?)",
                            r"Weighted Final Score:\s*(\d+(?:\.\d+)?)",
                            r"Final Weighted Score:\s*(\d+(?:\.\d+)?)"
                        ]

                        for pattern in score_patterns:
                            if match := re.search(pattern, evaluation.value):
                                score = float(match.group(1))
                                break
                        else:
                            logger.warning("Could not extract numerical score from evaluation")
                            score = 0

                        if score > best_score:
                            best_score = score
                            best_svg = svg_output.value
                    except Exception as e:
                        logger.error(f"Score extraction failed: {str(e)}")
                        score = 0

                    # Compute and propagate gradients through the entire computation graph
                    evaluation.backward()

                    # Update parameters using the optimizer
                    optimizer.step()
                    optimizer.zero_grad()

                    output_md += f"\n ---\n"

                    # Early stopping if score is very high
                    if best_score > 95 and allow_early_stop:
                        logger.info("Achieved excellent score, stopping early")
                        break

                    pbar.set_postfix({"Score": f"{score:.2f}", "Best": f"{best_score:.2f}"})
                    pbar.update(1)

            # Add final statistics
            end_time = datetime.datetime.now()
            duration = end_time - start_time

            output_md += "\n## Optimization Statistics\n"
            output_md += f"- Duration: {duration.total_seconds()/60:.2f} minutes\n"
            output_md += f"- Iterations: {i+1}\n"
            output_md += f"- Best Score: {best_score}\n"
            if best_svg: output_md += f"\n### Best SVG:\n{best_svg}\n"
            output_md += f"\n### Initial Prompt:\n{description}\n"
            output_md += f"\n### Optimized Prompt:\n{prompt.value}\n"
            output_md += f"\n### Final System Prompt:\n{self.system_prompt.value}\n"

            return output_md

        except Exception as e:
            logger.error(f"Optimization failed: {str(e)}", exc_info=True)
            raise

def main():
    from openai import OpenAI

    # Setup
    client = OpenAI(
        base_url="http://0.0.0.0:11434/v1",
        api_key="ollama",
        timeout=300.0,
    )
    optimizer = SVGPromptTuner(
        client,
        generation_model='qwen2.5-coder:32b-instruct-q6_K',
        feedback_model='qwen2.5-coder:32b-instruct-q6_K'
    )

    # Initial description
    description = """Create a SVG of an 1800s-era British explorer.
    Use only black and white. Do not use any colors. Use a transparent background.
    Use a simple style. Make the image 100x100."""

    # Run optimization
    output_md = optimizer.optimize_svg(description)

    # Save results
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    with open(f"output_{timestamp}.md", "w", encoding="utf-8") as f:
        f.write(output_md)
    logger.info(f"Successfully wrote output to output_{timestamp}.md")

if __name__ == "__main__":
    main() __init__(self, client, generation_model: str, feedback_model: str = None):
        self.engine = ChatExternalClient(
            client=client,
            model_string=generation_model
        )
        if feedback_model:
            self.feedback_engine = ChatExternalClient(
                client=client,
                model_string=feedback_model
            )
        else:
            self.feedback_engine = self.engine
        # Set up the backward engine globally
        tg.set_backward_engine(self.feedback_engine, override=True)

        # Initialize system prompt with more specific guidance
        self.system_prompt = Variable(
            """You are an expert SVG graphics generator. Output ONLY valid SVG code with no additional text, explanations, or markdown.

            CRITICAL REQUIREMENTS:
            1. Output raw SVG code only - no explanations or surrounding text
            2. Use exactly 100x100 dimensions with proper viewBox="0 0 100 100"
            3. Use ONLY black and white colors (no grays or other colors)
            4. Maintain transparent background (do not set background color)

            TECHNICAL GUIDELINES:
            1. Use clean, efficient SVG code
            2. Implement proper viewBox and path usage
            3. Organize attributes consistently""",
            requires_grad=True,
            role_description="specialized system prompt for SVG generation"
        )

        self.model = BlackboxLLM(engine=self.engine, system_prompt=self.system_prompt)

        # Enhanced evaluation criteria
        self.evaluator = TextLoss(
            """Evaluate the SVG code using this weighted criteria system:

            1. Technical Correctness (40%):
            - Proper viewBox attribute usage
            - Valid path commands and attribute values
            - Efficient use of SVG elements
            - Clean group structure

            2. Style Requirements (30%):
            - Black and white color scheme only
            - Transparent background
            - Stroke width consistency
            - Appropriate level of detail

            3. Adherence to Description (30%):
            - Adherence to the provided description
            - Accuracy in representing the subject
            - Includes all elements specified in the description

            CRITICAL: Your evaluation MUST end with exactly this line:
            Final Score: [number] / 100

            Do not use any other score format. Do not add "Weighted" or change the format.
            """,
            engine=self.engine
        )

    def
