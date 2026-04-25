<script setup lang="ts">
import { ref, onMounted, nextTick , watch} from 'vue';
import { X, Send, Image as ImageIcon, Smile, Phone, Video } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import { useMessageStore } from '../stores/message';

const props = defineProps({
    targetUserId: { type: Number, required: true },
    targetName: { type: String, required: true },
    targetAvatar: { type: String, required: true }
});

const emit = defineEmits(['close']);

const authStore = useAuthStore();
const messageStore = useMessageStore();

const newMessage = ref('');
const messagesContainer = ref<HTMLElement | null>(null);

const scrollToBottom = async () => {
    await nextTick();
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
};
watch(
    () => messageStore.chatHistory,
    (newHistory) => {
        scrollToBottom();
        if (newHistory.length > 0) {
            const lastMsg = newHistory[newHistory.length - 1];
            
            if (lastMsg.sender_id === props.targetUserId && !lastMsg.is_read) {
                messageStore.markAsRead(props.targetUserId);
            }
        }
    },
    { deep: true }
);
onMounted(async () => {
    await messageStore.fetchChatHistory(props.targetUserId);
    messageStore.markAsRead(props.targetUserId);
});

// gửi tin
const handleSend = async () => {
    if (!newMessage.value.trim()) return;

    await messageStore.sendMessage(props.targetUserId, newMessage.value);
    newMessage.value = '';
    scrollToBottom();
};
</script>

<template>
<div class="fixed bottom-2 right-2 w-[320px] h-[380px] flex flex-col bg-white rounded-t-xl shadow-xl border z-40">

    <!-- HEADER -->
    <div class="flex items-center justify-between p-2.5 border-b bg-white rounded-t-xl">
        <div class="flex items-center gap-2">
            <img :src="targetAvatar" class="w-8 h-8 rounded-full object-cover">
            <div>
                <h4 class="font-semibold text-[14px]">{{ targetName }}</h4>
                <span class="text-[11px] text-gray-500">Đang hoạt động</span>
            </div>
        </div>

        <div class="flex gap-1 text-blue-600">
            <button class="p-1 hover:bg-gray-100 rounded-full"><Phone class="w-4 h-4"/></button>
            <button class="p-1 hover:bg-gray-100 rounded-full"><Video class="w-4 h-4"/></button>
            <button @click="emit('close')" class="p-1 hover:bg-red-50 rounded-full">
                <X class="w-5 h-5 text-gray-400"/>
            </button>
        </div>
    </div>

    <!-- CHAT -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-3 space-y-3 bg-white">

        <div 
            v-for="(msg, index) in messageStore.chatHistory" 
            :key="msg._id"
            class="flex items-end gap-2"
            :class="msg.sender_id === authStore.user?.ProfileID ? 'justify-end' : 'justify-start'"
        >

            <!-- Avatar người kia -->
            <img 
                v-if="msg.sender_id !== authStore.user?.ProfileID"
                :src="msg.sender_avatar || targetAvatar"
                class="w-6 h-6 rounded-full object-cover"
            />

            <div class="flex flex-col max-w-[75%]">

                <!-- Bubble -->
                <div 
                    class="px-3 py-2 rounded-2xl text-[14px]"
                    :class="msg.sender_id === authStore.user?.ProfileID
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'"
                >
                    {{ msg.content }}
                </div>

                <!-- Status -->
                <span 
                    v-if="msg.sender_id === authStore.user?.ProfileID 
                        && index === messageStore.chatHistory.length - 1"
                    class="text-[10px] text-gray-400 mt-1 px-1"
                >
                    {{ msg.is_read ? 'Đã xem' : 'Đã gửi' }}
                </span>

            </div>
        </div>
    </div>

    <!-- INPUT -->
    <div class="p-2 border-t bg-white">
        <div class="flex items-center gap-2">
            <button class="p-1 text-blue-600 hover:bg-gray-100 rounded-full">
                <ImageIcon class="w-5 h-5"/>
            </button>

            <input 
                v-model="newMessage"
                @keyup.enter="handleSend"
                placeholder="Aa"
                class="flex-1 bg-gray-100 rounded-full px-3 py-1.5 text-sm outline-none"
            />

            <button class="p-1 text-blue-600 hover:bg-gray-100 rounded-full">
                <Smile class="w-5 h-5"/>
            </button>

            <button 
                v-if="newMessage.trim()" 
                @click="handleSend"
                class="p-1 text-blue-600 hover:bg-blue-50 rounded-full"
            >
                <Send class="w-5 h-5"/>
            </button>
        </div>
    </div>

</div>
</template>