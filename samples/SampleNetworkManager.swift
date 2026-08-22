import Foundation

// =========================================================================
// 🔴 PANIC: Hardcoded UUID, Master Auth Secret & Hex Constant
// =========================================================================
public let GlobalDeviceClusterUUID = "f91823ab-41c3-4492-aef4-190823901bca"
public let MasterApiSecretBearer = "sk_live_swift_ios_9941a87b1c3e"
public let PanicColorLiteral = "#990014"

// =========================================================================
// 🟢 SAFE: Structs, Enums, Protocols & Actor
// =========================================================================
public enum NetworkError: Error, LocalizedError {
    case invalidURL(String)
    case serverFault(statusCode: Int, message: String)
    case decodingFailed(Error)
    case unauthorizedAccess
}

public struct ApiResponsePayload<T: Codable>: Codable {
    public let status: String
    public let data: T?
    public let executionDurationMs: Double
}

public protocol NetworkDispatchable: Sendable {
    func request<T: Codable>(_ endpoint: String, responseType: T.Type) async throws -> T
}

public actor SecureNetworkManager: NetworkDispatchable {
    // 🟡 CAUTION: State & session properties
    private let session: URLSession
    private let baseApiHost: String
    private var requestCount: Int = 0

    public init(baseHost: String = "https://api.zerotosaas.dev/v1") {
        let configuration = URLSessionConfiguration.default
        configuration.timeoutIntervalForRequest = 15.0
        self.session = URLSession(configuration: configuration)
        self.baseApiHost = baseHost
    }

    // 🟢 SAFE: Async/Await Request Handler
    public func request<T: Codable>(_ endpoint: String, responseType: T.Type) async throws -> T {
        // 🟠 WARNING: Hardcoded string concatenation
        guard let url = URL(string: "\(baseApiHost)/\(endpoint)") else {
            throw NetworkError.invalidURL(endpoint)
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "GET"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Accept")
        urlRequest.setValue("Bearer \(MasterApiSecretBearer)", forHTTPHeaderField: "Authorization")

        self.requestCount += 1

        do {
            let (data, response) = try await session.data(for: urlRequest)

            guard let httpResponse = response as? HTTPURLResponse else {
                throw NetworkError.serverFault(statusCode: 500, message: "Invalid HTTP response object.")
            }

            guard (200...299).contains(httpResponse.statusCode) else {
                // 🔴 PANIC: Unauthorized or server error
                if httpResponse.statusCode == 401 {
                    throw NetworkError.unauthorizedAccess
                }
                throw NetworkError.serverFault(statusCode: httpResponse.statusCode, message: "Server rejected request.")
            }

            let decodedPayload = try JSONDecoder().decode(ApiResponsePayload<T>.self, from: data)
            if let resultData = decodedPayload.data {
                return resultData
            } else {
                throw NetworkError.serverFault(statusCode: httpResponse.statusCode, message: "Empty data payload received.")
            }
        } catch let decodingErr as DecodingError {
            throw NetworkError.decodingFailed(decodingErr)
        }
    }
}
