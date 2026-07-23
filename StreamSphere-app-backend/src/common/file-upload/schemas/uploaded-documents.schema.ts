import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UploadStatus } from '../enums/upload-status.enum';
import { Types, Document } from 'mongoose';
import { DocumentTypes } from '../enums/document-type.enum';

export type UploadedDocumentDocument = UploadedDocument & Document;

@Schema({ collection: 'uploaded_documents', timestamps: true })
export class UploadedDocument {
    @Prop({ required: true })
    key!: string;

    @Prop() // public url if available
    url?: string;

    @Prop({ required: true })
    mime_type!: string;

    @Prop()
    size?: number;

    @Prop({ enum: UploadStatus, default: UploadStatus.INITIATED })
    status!: UploadStatus;

    @Prop({ enum: DocumentTypes, required: true })
    type!: DocumentTypes;

    @Prop()
    refType?: string;

    @Prop({ type: Types.ObjectId })
    refId?: Types.ObjectId;
}

export const UploadedDocumentSchema = SchemaFactory.createForClass(UploadedDocument);

