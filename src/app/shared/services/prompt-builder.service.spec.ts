import { PromptBuilderService } from './prompt-builder.service';
import { StyleConfig, StyleUiState } from '@data/services/ai-symbol-state.service';

describe('PromptBuilderService', () => {
  const builder = new PromptBuilderService();

  function state(culture: string): StyleUiState {
    return {
      selectedStyle: 'Mulberry',
      cultureText: culture,
      cultureEnabled: true,
      availableStyles: []
    };
  }

  function config(partial: Partial<StyleConfig>): StyleConfig {
    return {
      culture: { enabled: true, defaultValue: '' },
      ...partial
    };
  }

  it('puts culture in the subject sentence for a LoRA style', () => {
    const prompt = builder.buildPrompt({
      mode: 'text',
      userPrompt: 'a girl eating an apple',
      styleState: state('Indian'),
      styleConfig: config({ loraTrigger: 'gs_mulberry', prompt: '' })
    });

    expect(prompt).toBe('gs_mulberry, a girl eating an apple, in everyday Indian surroundings.');
  });

  it('omits the culture clause when the field is empty', () => {
    const prompt = builder.buildPrompt({
      mode: 'text',
      userPrompt: 'a girl eating an apple',
      styleState: state('  '),
      styleConfig: config({ loraTrigger: 'gs_mulberry', prompt: '' })
    });

    expect(prompt).toBe('gs_mulberry, a girl eating an apple.');
  });

  it('keeps the style sentence after the subject', () => {
    const prompt = builder.buildPrompt({
      mode: 'text',
      userPrompt: 'a girl eating an apple.',
      styleState: state('Japanese'),
      styleConfig: config({
        prompt: 'Minimalist cartoon symbol, at most three flat colours, thick black outline, plain white background.'
      })
    });

    expect(prompt).toBe(
      'a girl eating an apple, in everyday Japanese surroundings. Minimalist cartoon symbol, at most three flat colours, thick black outline, plain white background.'
    );
  });

  it('describes an uploaded image when there is no typed subject', () => {
    const prompt = builder.buildPrompt({
      mode: 'image',
      userPrompt: '',
      styleState: state('Indian'),
      styleConfig: config({ loraTrigger: 'gs_mulberry', prompt: '' })
    });

    expect(prompt).toBe('gs_mulberry, Redraw this symbol in everyday Indian surroundings.');
  });

  it('ignores culture text when the style has culture disabled', () => {
    const prompt = builder.buildPrompt({
      mode: 'text',
      userPrompt: 'a red bus',
      styleState: state('Indian'),
      styleConfig: config({
        culture: { enabled: false, defaultValue: '' },
        prompt: 'Realistic symbol on a plain white background.'
      })
    });

    expect(prompt).toBe('a red bus. Realistic symbol on a plain white background.');
  });
});
