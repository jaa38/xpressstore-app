import * as FileSystem from "expo-file-system";

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
function getReceiptsDirectory(): FileSystem.Directory {
  const directory = new FileSystem.Directory(
    FileSystem.Paths.document,
    RECEIPTS_DIRECTORY_NAME
  );

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

  const destination = new FileSystem.File(directory, fileName);

  if (destination.exists) {
    destination.delete();
  }

  await FileSystem.copyAsync({
    from: sourceUri,
    to: destination.uri,
  });

  return destination.uri;
}
