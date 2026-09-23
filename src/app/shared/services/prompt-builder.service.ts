import { Injectable } from '@angular/core';
import { PromptOptions } from '@data/models/ai-symbol.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PromptBuilderService {

  buildPrompt(options: PromptOptions): string {
    const { mode, userPrompt, styleState, styleConfig } = options;
    const trigger = styleConfig?.loraTrigger?.trim() || '';
    const styleSentence = this.sentence(styleConfig?.prompt || '');
    const culture = styleConfig?.culture?.enabled ? (styleState.cultureText || '').trim() : '';

    let subject = this.sentence(userPrompt || '');
    if (!subject && mode === 'image') {
      subject = culture
        ? `Redraw this symbol in everyday ${culture} surroundings`
        : 'Redraw this symbol';
    } else if (subject && culture) {
      subject = `${subject}, in everyday ${culture} surroundings`;
    }

    const parts = [subject, styleSentence].filter(part => part.length > 0);
    let fullPrompt = parts.join('. ');
    if (fullPrompt && !/[.!?]$/.test(fullPrompt)) {
      fullPrompt = `${fullPrompt}.`;
    }
    if (trigger) {
      fullPrompt = fullPrompt ? `${trigger}, ${fullPrompt}` : trigger;
    }
    return fullPrompt;
  }

  private sentence(value: string): string {
    return value.trim().replace(/^[.\s]+/, '').replace(/[.!\s]+$/, '');
  }
}
