import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Image, FlatList } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as Contacts from 'expo-contacts/legacy';
import { globalStyles } from '../styles/globalStyles.js';
import BotaoCustomizado from '../components/botaoCustomizado.js';

export default function RegistroVisitaScreen() {
    const [localizacao, setLocalizacao] = useState(null);
    const [imagemEvidencia, setImagemEvidencia] = useState(null);
    const [contatoSelectionado, setContatoSelecionado] = useState(null);
    const [listaContatosDisponiveis, setlistContatosDisponiveis] = useState([]);

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
        const {status} = await ImagePicker.requestCameraPermissionsAsync();

        if(status !== 'granted'){
            Alert.alert('Erro de Permissao', 'Acesso a câmera é obrigatório para registro fotodocumental');

            return;
        }

        const resultado = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images', 'videos'],
            quality: 0.8,
            allowsEditing: false
        });
        
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
        if(!localizacao || !imagemEvidencia || !contatoSelectionado){
            Alert.alert('Incorformidade de Dados', 'Todos os critérios de auditoria (GPS, evidência visual e produtor vinculado) devem ser preenchidos');
            return;
        }

        Alert.alert('Auditoria concluída', 'Relatório de visita técnica sincronizado com a central de exportação com sucesso');
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

                {imagemEvidencia && <Image source={{uri: imagemEvidencia}} style={globalStyles.imagemPreview}/>}
            </View>

            <View style={globalStyles.cardVisita}>

                <Text style={globalStyles.tituloSecao}>3. Produtor/ Representante logístico</Text>
                <BotaoCustomizado titulo={"Buscar produtors na agenda"} onPress={carregarContatosProdutos} tipo='primary' />

                {contatoSelectionado && (
                    <Text style={[globalStyles.textoInformativo, {color: '#27AE60', fontWeight: 'bold', marginVertical: 6}]}>
                        Vinculado a: {contatoSelectionado.name}
                    </Text>
                )}

                <FlatList
                    data={listaContatosDisponiveis}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({item}) => (
                        <Text style={globalStyles.itemListaContato} onPress={() => setContatoSelecionado(item)}>
                            {item.name}
                        </Text>
                    )}
                />
            </View>

            <BotaoCustomizado titulo ="Finalizar e assinar auditoria" onPress={finalizarRelatorioAuditoria} tipo='sucess' />
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}