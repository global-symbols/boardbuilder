import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '@env';
import { AiGenerationParams, AiGenerationResponse, AiImageToImageParams } from '@data/models/ai-symbol.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AiSymbolHttpService {

  constructor(private http: HttpClient) { }

  /**
   * Generate images from AI based on prompt parameters
   */
  generateImages(params: AiGenerationParams): Observable<AiGenerationResponse> {
    const requestId = Date.now().toString(36);
    const body: any = {
      prompt: params.prompt,
      steps: params.steps || 2,
      guidance_scale: 7.0,
      num_images: params.num_images || 4
    };

    // Only include adapter_name if loraAdapter has a non-empty value
    if (params.loraAdapter && params.loraAdapter.trim() !== '') {
      body.adapter_name = params.loraAdapter;
      if (params.loraStrength != null) {
        body.adapter_weight = params.loraStrength;
      }
    }

    return this.http.post<AiGenerationResponse>(
      `${environment.boardBuilderApiBase}/ai/generate_image`,
      body
    );
  }

  /**
   * Generate image variations from uploaded image using image-to-image AI
   */
  generateImageVariations(params: AiImageToImageParams): Observable<AiGenerationResponse> {
    const requestId = Date.now().toString(36);
    const body: any = {
      prompt: params.prompt,
      image: params.image,
      steps: params.steps || 2,
      guidance_scale: 7.0,
      num_images: params.num_images || 4
    };

    // Only include adapter_name if loraAdapter has a non-empty value
    if (params.loraAdapter && params.loraAdapter.trim() !== '') {
      body.adapter_name = params.loraAdapter;
      if (params.loraStrength != null) {
        body.adapter_weight = params.loraStrength;
      }
    }

    return this.http.post<AiGenerationResponse>(
      `${environment.boardBuilderApiBase}/ai/generate_image`,
      body
    );
  }

  

  /**
   * Download an image from URL as PNG file
   */
  downloadImage(imageUrl: string, filename: string): Observable<Blob> {
    return this.http.get(imageUrl, { responseType: 'blob' });
  }

  /**
   * Generate appropriate filename for downloaded image
   */
  generateFilename(prompt: string, style: string): string {
    const timestamp = new Date().toISOString().replace(/[:\-T\.Z]/g, '').slice(0, 14);
    const sanitizedPrompt = prompt.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
    const filename = `${sanitizedPrompt}_${style.toLowerCase()}_${timestamp}.png`.toLowerCase();
    return filename;
  }

  /**
   * Poll job status for image generation
   */
  pollJobStatus(jobId: string): Observable<AiGenerationResponse> {
    return this.http.get<AiGenerationResponse>(
      `${environment.boardBuilderApiBase}/ai/job_status`,
      { params: { job_id: jobId } }
    );
  }

  /**
   * Remove background from an image using the remove-background API
   */
  removeBackground(imageUrl: string): Observable<string> {
    const requestId = Date.now().toString(36);

    // Call the remove-background API with just the URL

    return this.http.post<{ image_url: string }>(
      `${environment.boardBuilderApiBase}/ai/remove_background`,
      { image_url: imageUrl }
    ).pipe(
      map(response => {
        return response.image_url;
      }),
      catchError(error => {
        console.error(`[AiSymbolHttpService] ✗ Remove background failed [${requestId}]:`, error);
        throw error;
      })
    );
  }

  /**
   * Handle the complete download flow - fetch blob and trigger download
   */
  performDownload(imageUrl: string, filename: string): Observable<void> {
    return new Observable(observer => {
      this.downloadImage(imageUrl, filename).subscribe({
        next: (blob) => {
          if (!blob) {
            console.error('[AiSymbolHttpService] Failed to fetch image blob');
            observer.error('Failed to fetch image blob');
            return;
          }

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);

          observer.next();
          observer.complete();
        },
        error: (error) => {
          console.error('[AiSymbolHttpService] ✗ Download failed:', error);
          observer.error(error);
        }
      });
    });
  }
}
