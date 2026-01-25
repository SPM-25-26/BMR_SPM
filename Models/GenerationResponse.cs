namespace eppoi.Models
{
    internal class GenerationResponse
    {
        public Candidate[] candidates { get; set; }
        public Usagemetadata usageMetadata { get; set; }
        public string modelVersion { get; set; }
        public string responseId { get; set; }

        public class Usagemetadata
        {
            public int promptTokenCount { get; set; }
            public int candidatesTokenCount { get; set; }
            public int totalTokenCount { get; set; }
            public Prompttokensdetail[] promptTokensDetails { get; set; }
            public int toolUsePromptTokenCount { get; set; }
            public Tooluseprompttokensdetail[] toolUsePromptTokensDetails { get; set; }
        }

        public class Prompttokensdetail
        {
            public string modality { get; set; }
            public int tokenCount { get; set; }
        }

        public class Tooluseprompttokensdetail
        {
            public string modality { get; set; }
            public int tokenCount { get; set; }
        }

        public class Candidate
        {
            public Content content { get; set; }
            public string finishReason { get; set; }
            public int index { get; set; }
            public Groundingmetadata groundingMetadata { get; set; }
        }

        public class Content
        {
            public Part[] parts { get; set; }
            public string role { get; set; }
        }

        public class Part
        {
            public string text { get; set; }
        }

        public class Groundingmetadata
        {
            public Groundingchunk[] groundingChunks { get; set; }
            public Groundingsupport[] groundingSupports { get; set; }
        }

        public class Groundingchunk
        {
            public Retrievedcontext retrievedContext { get; set; }
        }

        public class Retrievedcontext
        {
            public string title { get; set; }
            public string text { get; set; }
            public string fileSearchStore { get; set; }
        }

        public class Groundingsupport
        {
            public Segment segment { get; set; }
            public int[] groundingChunkIndices { get; set; }
        }

        public class Segment
        {
            public int startIndex { get; set; }
            public int endIndex { get; set; }
            public string text { get; set; }
        }

    }
}
