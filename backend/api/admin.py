from django.contrib import admin

from .models import Channel, Emote, EmoteSet, ChatFile, Message, MessageEmote

# Register your models here.

admin.site.register(Channel)
admin.site.register(Emote)
admin.site.register(EmoteSet)
admin.site.register(ChatFile)
admin.site.register(Message)
admin.site.register(MessageEmote)
