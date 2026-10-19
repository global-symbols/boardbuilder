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

    expect(prompt).toBe('gs_mulberry, a girl eating an apple, from everyday Indian life.');
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
      'a girl eating an apple, from everyday Japanese life. Minimalist cartoon symbol, at most three flat colours, thick black outline, plain white background.'
    );
  });

  it('describes an uploaded image when there is no typed subject', () => {
    const prompt = builder.buildPrompt({
      mode: 'image',
      userPrompt: '',
      styleState: state('Indian'),
      styleConfig: config({ loraTrigger: 'gs_mulberry', prompt: '' })
    });

    expect(prompt).toBe('gs_mulberry, Redraw this symbol from everyday Indian life.');
  });

  it('attaches culture to an object rather than its setting', () => {
    const prompt = builder.buildPrompt({
      mode: 'text',
      userPrompt: 'a red bus',
      styleState: state('Indian'),
      styleConfig: config({ loraTrigger: 'gs_mulberry', prompt: '' })
    });

    expect(prompt).toBe('gs_mulberry, a red bus, from everyday Indian life.');
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

  // Culture is not released yet: the box shows "Coming soon" and every shipped style keeps it off.
  it('ships with culture disabled for every style', async () => {
    const configs: { [style: string]: StyleConfig } = await (await fetch('/assets/ai-style-configs.json')).json();

    expect(Object.keys(configs).length).toBeGreaterThan(0);
    Object.entries(configs).forEach(([style, styleConfig]) =>
      expect(styleConfig.culture?.enabled).withContext(style).toBeFalse());
  });
});
