package org.back.back.global.sse;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class AdminSseEmitters {
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public void add(SseEmitter emitter){
        emitters.add(emitter);
        // 연결이 정상적으로 끝났으면 제거
        emitter.onCompletion(() -> emitters.remove(emitter));
        // 타임아웃되면 제거
        emitter.onTimeout(() -> emitters.remove(emitter));
        // 에러뜨면 제거
        emitter.onError((e)-> emitters.remove(emitter));
    }

    public void send(String text){
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().data(text));
            } catch(IOException e){
                emitters.remove(emitter);
            }
        }
    }
}
