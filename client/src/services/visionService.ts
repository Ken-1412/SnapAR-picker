import { DetectedObject, MOCK_SKUS } from '../data/mockData';

export interface VisionScanResult {
  timestamp: string;
  fps: number;
  npuLatencyMs: number;
  detectedObjects: DetectedObject[];
}

export interface PickVerificationResponse {
  success: boolean;
  code: 'VERIFIED' | 'WRONG_SKU' | 'QUANTITY_MISMATCH' | 'LOW_CONFIDENCE';
  message: string;
  expectedSku: string;
  scannedSku: string;
  expectedQty: number;
  scannedQty: number;
}

export class MockVisionService {
  private npuActive = true;
  private offlineMode = false;

  public setOfflineMode(offline: boolean) {
    this.offlineMode = offline;
  }

  public async scanEnvironment(): Promise<VisionScanResult> {
    // Simulate real-time NPU latency (10.7ms)
    const npuLatencyMs = this.offlineMode ? 9.4 : 10.7;

    const detectedObjects: DetectedObject[] = [
      {
        id: 'det-01',
        sku: 'SKU-2048',
        name: '500g High-Grade Green Tea Box',
        confidence: 0.98,
        bbox: { x: 38, y: 25, w: 24, h: 42 },
        rack: 'Rack C4-18',
        quantity: 5,
        status: 'target'
      },
      {
        id: 'det-02',
        sku: 'SKU-2049',
        name: '500g Black Tea Box',
        confidence: 0.89,
        bbox: { x: 65, y: 28, w: 20, h: 38 },
        rack: 'Rack C4-19',
        quantity: 12,
        status: 'nearby_similar'
      },
      {
        id: 'det-03',
        sku: 'SKU-8821',
        name: 'Unlabeled Cardboard Pallet',
        confidence: 0.72,
        bbox: { x: 12, y: 60, w: 22, h: 30 },
        rack: 'Floor C4',
        quantity: 1,
        status: 'irrelevant'
      }
    ];

    return {
      timestamp: new Date().toISOString(),
      fps: 60,
      npuLatencyMs,
      detectedObjects
    };
  }

  public verifyPick(targetSku: string, scannedSku: string, count: number, expectedQty: number): PickVerificationResponse {
    if (scannedSku !== targetSku) {
      return {
        success: false,
        code: 'WRONG_SKU',
        message: `Exception: Picked ${scannedSku} instead of target ${targetSku}`,
        expectedSku: targetSku,
        scannedSku,
        expectedQty,
        scannedQty: count
      };
    }

    if (count !== expectedQty) {
      return {
        success: false,
        code: 'QUANTITY_MISMATCH',
        message: `Quantity Mismatch: Picked ${count} units, expected ${expectedQty}`,
        expectedSku: targetSku,
        scannedSku,
        expectedQty,
        scannedQty: count
      };
    }

    return {
      success: true,
      code: 'VERIFIED',
      message: `AI Pick Verified: ${count} units of ${targetSku} confirmed on NPU`,
      expectedSku: targetSku,
      scannedSku,
      expectedQty,
      scannedQty: count
    };
  }
}

export const visionService = new MockVisionService();
