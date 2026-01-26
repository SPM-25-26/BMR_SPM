using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Options;
using System.Text.Json;

namespace eppoi.Models
{
    public class GeminiService(IOptions<GoogleGeminiOptions> options)
    {
        private string FileSearchStore = options.Value.FileSearchStore;

        private readonly string _key = options.Value.ApiKey;
        private readonly string _urlFileSearchStore = "https://generativelanguage.googleapis.com/v1beta/fileSearchStores";
        private readonly string _urlDataIngestion = "https://generativelanguage.googleapis.com/upload/v1beta";
        private readonly string _urlGenerateResponse = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

        public async Task<string> IngestFileToGemini(string filePath)
        {
            //FileSearchStore = (await CreateFileSearchStore()).name;
            return (await PostMultipartFromFileAsync($"{_urlDataIngestion}/{FileSearchStore}:uploadToFileSearchStore", _key, "ragdata", filePath)).name;
        }



        private async Task<FileSearchStorageResponse> CreateFileSearchStore()
        {
            using var client = new HttpClient();

            using var request = new HttpRequestMessage(HttpMethod.Post, $"{_urlFileSearchStore}?key={_key}")
            {
                Content = new StringContent("{ \"displayName\": \"EppoiDataStore\" }", mediaType: new System.Net.Http.Headers.MediaTypeHeaderValue("application/json"))
            };

            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var responseBody = await response.Content.ReadAsStringAsync();
            return System.Text.Json.JsonSerializer.Deserialize<FileSearchStorageResponse>(responseBody)!;
        }

        private static async Task<FileUploadResponse> PostMultipartFromFileAsync(string url, string apiKey, string displayName, string filePath)
        {
            using var client = new HttpClient();

            const string boundary = "boundary_separator";

            // Usa MultipartContent per multipart/related
            using var multipart = new MultipartContent("related", boundary);

            // Prima parte: metadata JSON
            var metadata = new StringContent(
                $$"""{"display_name": "{{displayName}}"}""",
                System.Text.Encoding.UTF8,
                "application/json");
            multipart.Add(metadata);

            // Seconda parte: contenuto del file
            var fileContent = new StreamContent(System.IO.File.OpenRead(filePath));
            fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/plain");
            fileContent.Headers.Add("Content-Transfer-Encoding", "binary");
            multipart.Add(fileContent);

            using var request = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = multipart
            };

            request.Headers.Add("X-Goog-Upload-Protocol", "multipart");
            request.Headers.Add("x-goog-api-key", apiKey);

            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var responseBody = await response.Content.ReadAsStringAsync();
            return System.Text.Json.JsonSerializer.Deserialize<FileUploadResponse>(responseBody)!;
        }

        public async Task<string> Ask(ContentsGeminiDto content)
        {
            using var client = new HttpClient();
            var reqJson = new
            {
                system_instruction = new 
                {
                    //26/01/2026 - Rut - modified following template here https://ai.google.dev/gemini-api/docs/prompting-strategies#gemini_3_flash_strategies
                    //parts = new[] { new { text = "Sei un assistente turistico. Rispondi alle domande relative alla città di Cupra Marittima per scopo di turismo, basandoti solo sul contenuto del File Search Store che ti verrà passato a parametro. Se l'utente fa domande fuori contesto rispondi educatamente che sei addestrato solo a rispondere su informazioni turistiche relative a Cupra Marittima. Se l'utente ti chiede informazioni che riguardano Cupra Marittima, ma che non sono nel file search store, ad esempio 'quali centrali nucleari posso visitare a Cupra?', rispondi che non sei a conoscenza di questo tipo di dati." } }
                    parts = new[] { new { text = "<role>Sei Gemini 3, un assistente specializzato nel fornire informazioni turistiche, relative alla città costiera di Cupra Marittima, contenute nel database RAG che ti viene fornito (file search store). Sei molto cortese, e preciso nel rispondere solo con le informazioni del file search store relative a Cupra Marittima, e ti rifiuti di rispondere a domande non pertinenti.</role><constraints>- Verbosità: Media - Tono: Amichevole - Informazioni fornite: Solo quelle contenute nel filesearch store, cioè relative a queste categorie di dati: attrazioni culturali, attrazioni naturalistiche, attrazioni relative allo svago e divertimenti, operatori economici, ristoranti, articoli su riviste, eventi, itinerari, negozi per lo shopping, e alloggi in cui dormire - Domande fuori contesto: Se l'utente fa domande non relative al turismo su Cupra Marittima, o se chiede informazioni sulla città non contenute nel database rag (filesearch store), rispondi che non sei addestrato per rispondere a questo.</constraints>" } }
                },
                content.contents,
                tools = new[]
                {
                    new { file_search = new { file_search_store_names =  new [] { $"fileSearchStores/{FileSearchStore}" } }}
                }
            };
             
            using var request = new HttpRequestMessage(HttpMethod.Post, _urlGenerateResponse)
            {
                Content = new StringContent(JsonSerializer.Serialize(reqJson),
                mediaType: new System.Net.Http.Headers.MediaTypeHeaderValue("application/json"))
            };

            request.Headers.Add("x-goog-api-key", _key);

            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var responseBody = await response.Content.ReadAsStringAsync();

            var res = System.Text.Json.JsonSerializer.Deserialize<GenerationResponse>(responseBody)!;

            if (res.candidates[0]?.groundingMetadata?.groundingSupports?.Length != 0)
                return res.candidates[0].content.parts[0].text;
            else
                return "Mi dispiace, sono addestrato solo a rispondere a domande relative alle informazioni turistiche su Cupra Marittima.";
        }
    }




    public class GoogleGeminiOptions
    {
        public string ApiKey { get; set; } = string.Empty;
        public string FileSearchStore { get; set; } = string.Empty;
    }


    internal class FileSearchStorageResponse
    {
        public string name { get; set; }
        public string displayName { get; set; }
        public DateTime createTime { get; set; }
        public DateTime updateTime { get; set; }
    }

    internal class FileUploadResponse
    {
        public string name { get; set; }
        public Response response { get; set; }

    }

    internal class Response
    {
        public string type { get; set; }
        public string parent { get; set; }
        public string documentName { get; set; }
        public string mimeType { get; set; }
        public string sizeBytes { get; set; }
    }

}
