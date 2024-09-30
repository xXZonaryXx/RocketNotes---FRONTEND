import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { ButtonText } from '../../components/ButtonText';
import { Textarea } from '../../components/Textarea';
import { NoteItem } from '../../components/NoteItem';
import { Section } from '../../components/Section';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

import { api } from "../../services/api";

import { Container, Form } from './styles';

export function New(){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [links, setLinks] = useState([]);
    const [newLink, setNewLink] = useState("");

    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState("");

    const navigate = useNavigate();

    function handleBack(){
        navigate(-1);
    }

    function handleAddLink(){
        setLinks(prevState => [...prevState, newLink]);
        setNewLink("");
    }

    function handleRemoveLink(linkDeleted){
        setLinks(prevState => prevState.filter(link => link !== linkDeleted));
    }

    function handleAddTag(){
        setTags(prevState => [...prevState, newTag]);
        setNewTag("");
    }

    function handleRemoveTag(tagDeleted){
        setTags(prevState => prevState.filter(tag => tag !== tagDeleted));
    }

    async function handleNewNote() {
        if(!title){
            return alert("Sua nota precisa de um título!")
        }

        if(links.length === 0){
            return alert("Sua nota precisa de um link!")
        }
        
        if(tags.length === 0){
            return alert("Sua nota precisa de uma Tag!")
        }

        if(newLink){
            return alert("Existe um link escrito no campo de adicao! Caso não o queira, deixe o campo vazio.")
        }
        
        if(newTag){
            return alert("Existe uma tag escrita no campo de adicao! Caso não a queira, deixe o campo vazio.")
        }
        
        await api.post("/notes", {
            title,
            description,
            tags,
            links
        });

        alert("Nota criada com sucesso!");
        navigate(-1);
    }

    return (
        <Container>
            <Header />

            <main>
                <Form>
                    <header>
                        <h1>Criar nota</h1>
                        <ButtonText 
                            title="Voltar" 
                            onClick={handleBack}
                        />
                    </header>

                    <Input
                    placeholder="Título"
                    onChange={e => setTitle(e.target.value)}
                    />

                    <Textarea
                    placeholder="Observações"
                    onChange={e => setDescription(e.target.value)}
                    />

                    <Section title="Links Úteis">
                        {
                            links.map((link, index) => (
                                <NoteItem
                                key={String(index)}
                                value={link}
                                onClick={() => handleRemoveLink(link)}
                                />
                            ))
                        }
                        <NoteItem
                        isNew
                        placeholder="Novo link"
                        value={newLink}
                        onChange={e => setNewLink(e.target.value)}
                        onClick={handleAddLink}
                        />
                    </Section>

                    <Section title="Marcadores">
                        <div className="tags">
                            {
                                tags.map((tag, index) => (
                                    <NoteItem
                                    key={String(index)}
                                    value={tag}
                                    onClick={() => handleRemoveTag(tag)}
                                    />
                                ))
                            }

                            <NoteItem
                            isNew
                            placeholder="Nova tag"
                            onChange={e => setNewTag(e.target.value)}
                            value={newTag}
                            onClick={handleAddTag}
                            />
                        </div>
                    </Section>

                    <Button
                    title="Salvar"
                    onClick={handleNewNote}
                    />
                </Form>
            </main>
        </Container>
    );
}