import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.Json
import net.dv8tion.jda.api.JDABuilder
import net.dv8tion.jda.api.entities.MessageChannel
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter

class MessageListener : ListenerAdapter(){
    private val help: String = "test".trimIndent()
    private val notFound: String = "test 2"

    private val serverUrl: String = System.getenv("URL_DC")

    @Override
    override fun onMessageReceived(event: MessageReceivedEvent) {
        super.onMessageReceived(event)
        runBlocking {
            val response = processRequest(event.message.contentStripped)
            sendMessage(event.channel, response)
        }
    }

    private fun sendMessage(channel:MessageChannel, message: String){
        channel.sendMessage(message).queue()
    }

    private suspend fun processRequest(message:String) : String{
        var returnMessage: String = ""

        if (message.contains("help")){
            returnMessage = help
        }
        else {
            returnMessage = notFound
        }

        return returnMessage
    }
}

fun buildDiscordBot(token: String, listener: MessageListener) : JDABuilder{
    val aJDABuilder = JDABuilder.createDefault(token)

    aJDABuilder.addEventListeners(listener)
    aJDABuilder.build()
    return aJDABuilder
}

val client = HttpClient(CIO){
    install(ContentNegotiation){
        json(Json {
            prettyPrint = true
            isLenient = true
        })
    }
}

fun main(args: Array<String>) {
    println("Kotlin - Ktor bot works!")

    val listener = MessageListener()
    val DiscordBot = buildDiscordBot(System.getenv("TOKEN_DC"), listener)
}