import { Injectable } from '@angular/core';
import { PromptOptions } from '@data/models/ai-symbol.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PromptBuilderService {

  constructor() {}

      buildPrompt(options: PromptOptions): string {
        const {
          mode,
          userPrompt,
          styleState,
          styleConfig
        } = options;
  
  if (!styleConfig || !styleConfig.prompt) {
    return userPrompt.trim();
  }
   
  // Helper function to extract tag content and replace tag
  const processTag = (prompt: string, tag: string, includeContent: boolean, replacementContent?: string): string => {
    const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, 'g');
    if (includeContent && replacementContent !== undefined) {
      // Replace with provided content, remove tags
      return prompt.replace(regex, replacementContent);
    } else if (includeContent) {
      // Keep original content, remove tags
      return prompt.replace(regex, '$1');
    } else {
      // Remove tag and its content
      return prompt.replace(regex, '');
    }
  };

  // Initialize the processed prompt
    let processedPrompt = styleConfig.prompt;

  // Process <culture> tag
      let includeCulture = styleConfig.culture.enabled;
      // hold the replacement content for the <culture> tag, if applicable.
      let cultureContent: string | undefined;
      if (includeCulture && styleConfig.culture.defaultValue.length === 0 && styleState.cultureText?.length > 0) {
        cultureContent = styleState.cultureText + ' culture'; // Use styleState.cultureText if non-empty
      } else if (includeCulture && styleConfig.culture.defaultValue.length > 0) {
        cultureContent = styleConfig.culture.defaultValue; // Use the default value from config
      }
      // If defaultValue is set or cultureText is empty, includeCulture remains true to keep original content
      processedPrompt = processTag(processedPrompt, 'culture', includeCulture, cultureContent);

  // Process <culture-placeholder> tag - uses the culture text from UI state
      if (styleConfig.culture.enabled && styleState.cultureText?.length > 0) {
        processedPrompt = processTag(processedPrompt, 'culture-placeholder', true,' in a ' + styleState.cultureText + ' culture');
      } else {
        // Remove the tag if culture is not enabled or no culture text
        processedPrompt = processTag(processedPrompt, 'culture-placeholder', false);
      }


  // Remove extra period after "outline"
  processedPrompt = processedPrompt.replace(/outline\.\s*\./g, 'outline.');

  // Combine userPrompt with processed prompt
  let fullPrompt = `${userPrompt.trim()}. ${processedPrompt.trim()}`.trim();

  const loraTrigger = styleConfig.loraTrigger?.trim();
  if (loraTrigger) {
    fullPrompt = `${loraTrigger}, ${fullPrompt}`;
  }

  return fullPrompt;

  }
}