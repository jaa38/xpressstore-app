import { Directory, File, Paths } from "expo-file-system";

/**
 * ---------------------------------------------------------------------------
 * Receipt Storage
 * ---------------------------------------------------------------------------
 *
 * Provides a single persistence layer for generated receipt PDFs.
 *
 * All receipts are stored inside the application's document directory:
 *
 * document/Receipts/
 */

const RECEIPTS_DIRECTORY_NAME = "Receipts";

/**
 * Ensures that the application's Receipts directory exists.
 */
function getReceiptsDirectory(): Directory {
  const directory = new Directory(Paths.document, RECEIPTS_DIRECTORY_NAME);

  if (!directory.exists) {
    directory.create();
  }

  return directory;
}

/**
 * Saves a generated receipt PDF into the application's Receipts directory.
 *
 * If a receipt with the same filename already exists, it is replaced.
 */
export async function saveReceiptPdf(
  sourceUri: string,
  fileName: string
): Promise<string> {
  const directory = getReceiptsDirectory();

  const sourceFile = new File(sourceUri);

  const destinationFile = new File(directory, fileName);

  /**
   * Remove an existing receipt with the same name.
   */
  if (destinationFile.exists) {
    destinationFile.delete();
  }

  /**
   * Use the modern Expo File API.
   */
  sourceFile.copy(destinationFile);

  return destinationFile.uri;
}
