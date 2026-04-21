import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('boards', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        # 1. Crear modelo Workspace
        migrations.CreateModel(
            name='Workspace',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('owner', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='workspaces',
                    to=settings.AUTH_USER_MODEL
                )),
            ],
        ),

        # 2. Agregar color y created_at a Board
        migrations.AddField(
            model_name='board',
            name='color',
            field=models.CharField(default='#0079BF', max_length=20),
        ),
        migrations.AddField(
            model_name='board',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),

        # 3. Agregar ForeignKey de Board a Workspace
        migrations.AddField(
            model_name='board',
            name='workspace',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='boards',
                to='boards.workspace'
            ),
        ),

        # 4. Agregar campo position a List
        migrations.AddField(
            model_name='list',
            name='position',
            field=models.IntegerField(default=0),
        ),

        # 5. Agregar created_at a Card
        migrations.AddField(
            model_name='card',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]