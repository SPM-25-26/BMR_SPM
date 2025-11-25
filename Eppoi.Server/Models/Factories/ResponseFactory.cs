using eppoi.Server.Models.Responses;

namespace eppoi.Server.Models.Factories
{
    public class ResponseFactory
    {
        public static BasicResponse<T> WithSuccess<T>(T result)
        {
            var response = new BasicResponse<T>
            {
                Success = true,
                Result = result
            };
            return response;
        }

        public static BasicResponse<T> WithError<T>(T result)
        {
            var response = new BasicResponse<T>
            {
                Success = false,
                Result = result
            };
            return response;
        }

        public static BasicResponse<string?> WithError(Exception exception)
        {
            var response = new BasicResponse<string?>
            {
                Success = false,
                Errors = [exception.Message]
            };
            return response;
        }
    }
}
