from kivy.app import App
from kivy.uix.screenmanager import ScreenManager, Screen
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button
from kivy.clock import Clock
import random

class WordInputScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.layout = BoxLayout(orientation='vertical', padding=10, spacing=10)
        self.add_widget(self.layout)

        # Campo para introducir número de palabras
        self.num_input = TextInput(
            hint_text='Número de papeles',
            input_filter='int',
            multiline=False
        )
        self.layout.add_widget(self.num_input)

        # Botón para generar campos de texto según el número introducido
        self.generate_btn = Button(text='Generar campos')
        self.generate_btn.bind(on_press=self.generate_fields)
        self.layout.add_widget(self.generate_btn)

        # Contenedor para los TextInput de las palabras
        self.fields_container = BoxLayout(
            orientation='vertical',
            spacing=5
        )
        self.layout.add_widget(self.fields_container)

        # Botón para iniciar el juego
        self.start_btn = Button(text='Iniciar juego', disabled=True)
        self.start_btn.bind(on_press=self.start_game)
        self.layout.add_widget(self.start_btn)

    def generate_fields(self, instance):
        self.fields_container.clear_widgets()
        try:
            n = int(self.num_input.text)
        except ValueError:
            return
        self.word_fields = []
        for i in range(n):
            ti = TextInput(hint_text=f'Palabra {i+1}', multiline=False)
            self.fields_container.add_widget(ti)
            self.word_fields.append(ti)
        self.start_btn.disabled = False

    def start_game(self, instance):
        # Recolecta y baraja las palabras introducidas
        words = [f.text.strip() for f in self.word_fields if f.text.strip()]
        if not words:
            return
        random.shuffle(words)
        game_screen = self.manager.get_screen('game')
        game_screen.setup_game(words)
        self.manager.current = 'game'

class GameScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.layout = BoxLayout(orientation='vertical', padding=10, spacing=10)
        self.add_widget(self.layout)

        # Etiqueta para el temporizador
        self.time_label = Label(text='Tiempo restante: 60')
        self.layout.add_widget(self.time_label)

        # Etiqueta para mostrar la palabra actual
        self.word_label = Label(text='')
        self.layout.add_widget(self.word_label)

        # Botón para pasar a la siguiente palabra
        self.next_btn = Button(text='Siguiente palabra', disabled=True)
        self.next_btn.bind(on_press=self.next_word)
        self.layout.add_widget(self.next_btn)

        # Variables de juego
        self.words = []
        self.timer_event = None

    def setup_game(self, words):
        self.words = words.copy()
        self.next_btn.disabled = False
        self.remaining = 60
        self.time_label.text = f'Tiempo restante: {self.remaining}'
        if self.timer_event:
            self.timer_event.cancel()
        self.timer_event = Clock.schedule_interval(self.update_timer, 1)
        self.next_word()

    def update_timer(self, dt):
        self.remaining -= 1
        self.time_label.text = f'Tiempo restante: {self.remaining}'
        if self.remaining <= 0:
            self.timer_event.cancel()
            self.next_btn.disabled = True
            self.word_label.text = '¡Tiempo de ronda finalizado!'

    def next_word(self, instance=None):
        if self.words and self.remaining > 0:
            self.word_label.text = self.words.pop()
        else:
            if self.timer_event:
                self.timer_event.cancel()
            self.word_label.text = 'Juego terminado'
            self.next_btn.disabled = True

class WordGameApp(App):
    def build(self):
        sm = ScreenManager()
        sm.add_widget(WordInputScreen(name='input'))
        sm.add_widget(GameScreen(name='game'))
        return sm

if __name__ == '__main__':
    WordGameApp().run()
