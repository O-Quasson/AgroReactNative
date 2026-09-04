 import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Image, FlatList, TextInput, Button } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as Contacts from 'expo-contacts/legacy';
import { Accelerometer } from 'expo-sensors';
import { globalStyles } from '../styles/globalStyles.js';
import BotaoCustomizado from '../components/botaoCustomizado.js';

export default function RegistroVisitaScreen() {
    const [localizacao, setLocalizacao] = useState(null);
    const [imagemEvidencia, setImagemEvidencia] = useState(null);
    const [contatoSelectionado, setContatoSelecionado] = useState(null);
    const [listaContatosDisponiveis, setListaContatosDisponiveis] = useState([]);

    const [filtro, setFiltro] = useState();
    const [listaFiltro, setListaFiltro] = useState([]);

    const [{x, y, z}, setAcelerometro] = useState({
        x: 0,
        y: 0,
        z: 0
    });

    const [travar, setTravado] = useState(false);

    const dados = [
        { id: '1', titulo: 'Primeiro Item', descricao: 'Descrição detalhada do primeiro item da lista.' },
        { id: '2', titulo: 'Segundo Item', descricao: 'Descrição detalhada do segundo item da lista.' },
        { id: '3', titulo: 'Terceiro Item', descricao: 'Descrição detalhada do terceiro item da lista.' },
        { id: '4', titulo: 'Quarto Item', descricao: 'Descrição detalhada do quarto item da lista.' },
        { id: '5', titulo: 'Quinto Item', descricao: 'Descrição detalhada do quinto item da lista.' },
        { id: '6', titulo: 'Sexto Item', descricao: 'Descrição detalhada do sexto item da lista.' },
        { id: '7', titulo: 'Sétimo Item', descricao: 'Descrição detalhada do sétimo item da lista.' },
        { id: '8', titulo: 'Oitavo Item', descricao: 'Descrição detalhada do oitavo item da lista.' },
        { id: '9', titulo: 'Nono Item', descricao: 'Descrição detalhada do nono item da lista.' },
        { id: '10', titulo: 'Décimo Item', descricao: 'Descrição detalhada do décimo item da lista.' },
        { id: '11', titulo: 'Décimo Primeiro', descricao: 'Descrição detalhada do décimo primeiro item.' },
        { id: '12', titulo: 'Décimo Segundo', descricao: 'Descrição detalhada do décimo segundo item.' },
        { id: '13', titulo: 'Décimo Terceiro', descricao: 'Descrição detalhada do décimo terceiro item.' },
        { id: '14', titulo: 'Décimo Quarto', descricao: 'Descrição detalhada do décimo quarto item.' },
        { id: '15', titulo: 'Décimo Quinto', descricao: 'Descrição detalhada do décimo quinto item.' }
    ];


    Accelerometer.setUpdateInterval(500);

    const capturarCoordenadasGPS = async() => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if(status !== 'granted') {
            
            Alert.alert('Erro de Permissão', 'O acesso ao GPS é vital para a validação legal da auditoria')

            return;
        }

        const posicao = await Location.getCurrentPositionAsync(
            { accuracy: Location.Accuracy.BestForNavigation }
        );

        setLocalizacao(posicao.coords);
    };

    const capturarFotoEvidencia = async () => {
        const {status, canAskAgain} = await ImagePicker.requestCameraPermissionsAsync();

        //!==
        if(status !== 'granted'){

            if(!canAskAgain){
                Alert.alert("cu", "cu que brilha");

                return;
            }

            Alert.alert('Erro de Permissao', 'Acesso a câmera é obrigatório para registro fotodocumental');

            return;
        }

        // const resultado = await ImagePicker.launchCameraAsync({
        //     mediaTypes: ['images', 'videos'],
        //     quality: 0.8,
        //     allowsEditing: false
        // });
        
        if(!resultado.canceled) {
            setImagemEvidencia(resultado.assets[0].uri);
        }
    };

    const carregarContatosProdutos = async () => {
        const { status } = await Contacts.requestPermissionsAsync();

        if(status !== 'granted') {
            Alert.alert('Erro', "Não é possível carregar os representantes locais sem acesso aos contatos");

            return;
        }

        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers]
        });

        setListaContatosDisponiveis(data.slice(0,3));
    };

    const finalizarRelatorioAuditoria = () => {

        if(Math.sqrt(x*x + y*y + z*z)>2.0){
            setTravado(true);
            return;
        }

        if(!localizacao || !imagemEvidencia || !contatoSelectionado){
            Alert.alert('Incorformidade de Dados', 'Todos os critérios de auditoria (GPS, evidência visual e produtor vinculado) devem ser preenchidos');
            return;
        }

        Alert.alert('Auditoria concluída', 'Relatório de visita técnica sincronizado com a central de exportação com sucesso');
    }

    function botao() {
        
    }

    function insiraFiltro() {
        setListaFiltro(dados.filter(item => item.nome == filtro));
    }

    return(
        <ScrollView style={globalStyles.container} nestedScrollEnabled={true}>
            <View style={globalStyles.cardVisita}>

                <Text style={globalStyles.tituloSecao}>1. Georreferenciamento de Lote</Text>
                <BotaoCustomizado titulo={"Marcar localização atual"} onPress={capturarCoordenadasGPS} tipo='primary' />

                {localizacao && (
                    <View style={{marginTop: 8}}> 
                        <Text style={globalStyles.textoInformativo}>Lat: {localizacao.latitude.toFixed(6)}</Text>
                        <Text style={globalStyles.textoInformativo}>Long: {localizacao.longitude.toFixed(6)}</Text>
                        <Text style={globalStyles.textoInformativo}>Precisão alvo: {localizacao.accuracy.toFixed(1)}</Text>
                    </View>
                )}

            </View>

            <View style={globalStyles.cardVisita}>

                <Text style={globalStyles.tituloSecao}>2. Evidência de qualidade de grãos</Text>
                <BotaoCustomizado titulo={"Acionar câmera de campo"} onPress={capturarFotoEvidencia} tipo='warning' />

                {imagemEvidencia && <Image source={{uri: imagemEvidencia}} style={globalStyles.imagePreview}/>}
            </View>

            <View style={globalStyles.cardVisita}>

                <Text style={globalStyles.tituloSecao}>3. Produtor/ Representante logístico</Text>
                <BotaoCustomizado titulo={"Buscar produtors na agenda"} onPress={carregarContatosProdutos} tipo='primary' />

                {contatoSelectionado && (
                    <Text style={[globalStyles.textoInformativo, {color: '#27AE60', fontWeight: 'bold', marginVertical: 6}]}>
                        Vinculado a: {contatoSelectionado.name}
                    </Text>
                )}

                <TextInput value={filtro} style={[{width: '100%', height: 40, border: '2px solid rgba(136, 137, 136, 0.98)', borderRadius: 4, padding: 10, marginBottom: 10}]} placeholder='Procure nome aqui' onChangeText={insiraFiltro}/>

                <FlatList
                    // data={listaContatosDisponiveis}
                    data={listaFiltro}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={true}
                    renderItem={({item}) => (
                        <View style={[{display: 'flex', flexDirection: 'column', border: '2px solid rgb(63, 74, 109)', borderRadius: 12, padding: 12, marginBottom: 12, gap: 5}]}>
                            <View>
                                <Text style={globalStyles.itemListaContato [{fontWeight: 'bold', fontSize: 20}]} onPress={() => setContatoSelecionado(item)}>
                                    {/* {item.name} */}
                                    {item.id}
                                </Text>
                            </View>

                            <View style={[{gap: 5}]}>
                                <Text>{item.titulo}  </Text>
                                <View style={[{width: '100%', border: '1px solid #000000'}]}></View>
                                <Text style>{item.descricao}</Text>
                            </View>
                            
                        </View>
                        
                    )}
                    style={[{height: 300, padding: 12}]}
                    showsVerticalScrollIndicator={true}

                />
            </View>

            {travar ? <Button title="Instabilidade Física Detectada"/> : <BotaoCustomizado titulo ="Finalizar e assinar auditoria" onPress={finalizarRelatorioAuditoria} tipo='sucess' />}

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}